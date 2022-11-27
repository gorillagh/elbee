import axios from "axios";

export const uploadFile = async (file) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/uploadfile`, file);
};
