import axios from "axios";

export const getUser = async (id) => {
  return await axios.get(`${process.env.REACT_APP_API_URL}/get-user/${id}`);
};
