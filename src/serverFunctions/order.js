import axios from "axios";

export const uploadFile = async (file) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/uploadfile`, file);
};

export const saveOrderToDb = async (order) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/saveorder`, order);
};

export const getOrder = async (orderId) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/getorder/${orderId}`
  );
};

export const updateOrder = async (orderId, orderInfo) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/update-order/${orderId}`,
    orderInfo
  );
};

export const createPaymentIntent = async (orderId, orderInfo) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/create-payment-intent/${orderId}`,
    orderInfo
  );
};

export const completeOrder = async (orderId, payload) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/complete-order/${orderId}`,
    payload
  );
};
