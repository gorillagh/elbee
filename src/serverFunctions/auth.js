import axios from "axios";

export const createOrUpdateUser = async (authtoken, phoneNumber, name) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/create-or-update-user`,
    { phoneNumber, name },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const googleLogin = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/google-login`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const loginUser = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/login-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const currentUser = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/current-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const currentAdmin = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/current-admin`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const checkEmailAvailability = async (email) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/check-email-availability`,
    {},
    {
      headers: {
        email,
      },
    }
  );
};

export const updateUser = async (authtoken, update, slug) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/update-user/${slug}`,
    update,
    {
      headers: {
        authtoken,
      },
    }
  );
};
