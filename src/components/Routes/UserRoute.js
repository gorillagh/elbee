import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

import LoadingToRedirect from "./LoadingToRedirect";

const UserRoute = ({ children }) => {
  const { user } = useSelector((state) => ({ ...state }));
  return user && user.token ? (
    <Box>{children}</Box>
  ) : (
    <LoadingToRedirect message="You are not logged in." />
  );
};

export default UserRoute;
