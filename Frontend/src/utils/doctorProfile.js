import axios from "axios";

const doctorProfile = async (doctor) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:4000/doctor/profile/${doctor}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        // params: { doctor },
      }
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching appointments:",
      error.response?.data || error.message
    );
    // return Navigate("/");
  }
};

export default doctorProfile;