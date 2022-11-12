import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 400,
  minWidth: 250,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 2,
};

const LoadingToRedirect = (props) => {
  const [count, setCount] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    count === 0 && navigate("/login");
    return () => clearInterval(interval);
  }, [count, navigate]);

  return (
    <Box>
      <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box textAlign="center" sx={style}>
          <Typography
            color="#FF0000"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Unauthorized Access!
          </Typography>
          <Typography
            variant="p"
            component="p"
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            {props.message}
          </Typography>
          <Typography
            variant="p"
            component="p"
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            redirecting in {count + " second(s)"}
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default LoadingToRedirect;
