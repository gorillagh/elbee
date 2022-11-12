import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, LinearProgress } from "@mui/material";

const LoadingBackdrop = (props) => {
  //   const handleClose = () => {
  //     setOpen(false);
  //   };
  //   const handleToggle = () => {
  //     setOpen(!open);
  //   };

  return (
    <div>
      <Backdrop
        sx={{
          color: "secondary.light",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={props.open}
        // onClick={handleClose}
      >
        <Box sx={{ width: "20%" }}>
          <LinearProgress color="inherit" />
        </Box>
        {/* <CircularProgress color="inherit" /> */}
      </Backdrop>
    </div>
  );
};

export default LoadingBackdrop;
