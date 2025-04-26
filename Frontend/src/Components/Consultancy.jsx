import React, { useState, useEffect } from 'react';
import './Consultancy.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbars } from './Navbars';
import { Footer } from './Footer.jsx';
import AppointmentImg from '../assets/AppointmentImg/svg.png';


const Consultancy = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    gender: '',
    doctor: '',    
    disease: '',
    dateOfAppointment: '',
    timing: '',
    mobile: '',
    email: '',
    fee: '',
    token: '',
  });
  const [error, setError] = useState('');
  const [appointment, setAppointment] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [token, setToken] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const navigate = useNavigate();

  // Fetch all doctors from backend on component mount
  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        // const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/getAllDoctors");
        // Assuming response.data.doctors returns an array of doctor objects
        setAllDoctors(response.data.doctors);
      } catch (error) {
        console.error("Error fetching all doctors:", error);
      }
    };
    fetchAllDoctors();
  }, []);

  // Get unique issues from all doctors (using "specialization" field)
  const getUniqueIssues = () => {
    const issuesSet = new Set();
    allDoctors.forEach(doc => {
      if (doc.specialization) {
        issuesSet.add(doc.specialization);
      }
    });
    return Array.from(issuesSet);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleDiseaseChange = (e) => {
    const selectedDisease = e.target.value;
    setFormData(prevFormData => ({
      ...prevFormData,
      disease: selectedDisease,
      doctor: '', // Reset doctor selection when disease changes
      fee: ''     // Reset Fee when disease changes
    }));

    // Filter doctors based on the "specialization"
    const doctorsForDisease = allDoctors.filter(doc => doc.specialization === selectedDisease);
    setAvailableDoctors(doctorsForDisease);
  };

  // Handle doctor selection from available list
  const handleDoctorChange = (e) => {
    const selectedDoctor = availableDoctors.find(doc => doc.name === e.target.value);
    setFormData(prevFormData => ({
      ...prevFormData,
      doctor: selectedDoctor ? selectedDoctor.name : '',
      fee: selectedDoctor ? selectedDoctor.fee : ''
    }));
    setDoctor(selectedDoctor);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Find selected doctor from the available list
    const selectedDoctorArr = availableDoctors.filter(doc => doc.name === formData.doctor);
    if (selectedDoctorArr.length === 0) {
      setError('No doctor available for this medical issue');
      setAppointment(false);
      return;
    }

    const newToken = Math.floor(1000 + Math.random() * 9000);
    setToken(newToken);

    const payload = { 
      ...formData, 
      fee: selectedDoctorArr[0].fee, 
      token: newToken 
    };
    console.log("payload", payload);

    try {
      const response = await axios.post('http://localhost:4000/Consultancy', payload);
      if (response) {
        console.log('Response Data:', response);
      } else {
        console.error('No response received');
      }
      setAppointment(true);
      setError('');
    } catch (err) {
      console.error("Error booking consultation", err);
      setError('Error booking consultation');
    }

    setDoctor(selectedDoctorArr[0]);
  };

  const videoCallingHandler = () => {
    navigate("/videoCall");
  };

  return (
    <>
      <Navbars />
      <div className="intro-section">
        <div className="intro-content">
          <h2>
            Welcome to Our<br/><marquee><span>Consultancy Services</span></marquee>
          </h2>
          <p>
            We are dedicated to providing expert medical advice and care tailored to
            your needs. Book an appointment with highly experienced doctors for a range of specialties, all at your convenience.
          </p>
        </div>
        <div className="intro-image">
          <img
            src={AppointmentImg}
            alt="Consultancy illustration"
            className="svg-image"
          />
        </div>
      </div>
      <button className='videocalling' onClick={videoCallingHandler}>Start Video Call</button>
      <br></br>
      <div className="main-form">
        <div className="consultancy">
          <h2 className="pageheading">Consultancy Portal</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Left Section */}
              <div className="form-half">
                <h2>Personal Details</h2>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Age:</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Gender:</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Right Section */}
              <div className="form-half">
                <h2>Appointment Details</h2>
                <div className="form-group">
                  <label>Select Disease:</label>
                  <select name="disease" value={formData.disease} onChange={handleDiseaseChange}>
                    <option value="">Select a disease</option>
                    {getUniqueIssues().map((disease, index) => (
                      <option key={index} value={disease}>{disease}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Select Doctor:</label>
                  <select name="doctor" value={formData.doctor} onChange={handleDoctorChange} disabled={!formData.disease}>
                    <option value="">Select a doctor</option>
                    {availableDoctors.map(doc => (
                      <option key={doc.name} value={doc.name}>
                        {doc.name} - ₹{doc.fee}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date of Appointment:</label>
                  <input
                    type="date"
                    name="dateOfAppointment"
                    value={formData.dateOfAppointment}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Timing:</label>
                  <input
                    type="time"
                    name="timing"
                    value={formData.timing}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Mobile:</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <button type="submit" id="book" className="submit-btn">
              Book Appointment
            </button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {appointment && (
            <p>
              Appointment confirmed with Dr. {doctor.name} on {formData.dateOfAppointment} at {formData.timing}!{' '}
              <h3>Your token number is {token}</h3>
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Consultancy;