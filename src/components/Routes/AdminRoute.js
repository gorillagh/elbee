import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import LoadingToRedirect from "./LoadingToRedirect";
import { currentAdmin } from "../../serverFunctions/auth";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
// import AdminNavBar from "../Navbars/AdminNavBar";

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          setOk(true);
          console.log("Current admin -->", res);
        })
        .catch((err) => {
          setOk(false);
          console.log(err);
          toast.error(err);
        });
    }
  }, [user]);

  return ok ? (
    <Box>
      {/* <AdminNavBar /> */}
      {children}
    </Box>
  ) : (
    <LoadingToRedirect message="Make sure you have administrative rights." />
  );
};

export default AdminRoute;
