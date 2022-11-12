import React, { useState } from "react";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import { toast } from "react-toastify";
import ActionButton from "../Buttons/ActionButton";
import LoadingBackdrop from "../Feedbacks/LoadingBackdrop";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 400,
  minWidth: 250,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "16px",
  p: 4,
};

const ForgotPassword = ({
  email,
  setEmail,
  openForgotPasswordModal,
  setOpenForgotPassworModal,
}) => {
  const [hideForm, setHideForm] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [hideEmailMsg, setHideEmailMsg] = useState("none");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const config = {
        url: process.env.REACT_APP_PASSWORD_RESET_REDIRECT_URL,
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, email, config);
      toast.success(`Password reset link sent to ${email}`);
      setEmailMsg(email);
      setHideForm("none");
      setHideEmailMsg("");
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <div>
      <Modal
        open={openForgotPasswordModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ fontWeight: "bold", mb: 2 }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Forgot Password?
          </Typography>
          <Typography
            display={hideEmailMsg}
            sx={{ mb: 2 }}
            component="small"
            variant="small"
          >
            Click on the link sent to <Link underline="none">{emailMsg}</Link>{" "}
            to reset your password.
          </Typography>
          <br />
          <Typography
            display={hideEmailMsg}
            sx={{ mb: 2 }}
            component="small"
            variant="small"
          >
            made a mistake?{" "}
            <Link
              onClick={() => {
                setHideEmailMsg("none");
                setHideForm("");
              }}
              sx={{ cursor: "pointer" }}
            >
              Re-enter details
            </Link>
          </Typography>
          <Typography
            display={hideForm}
            id="modal-modal-description"
            variant="small"
            component="small"
            sx={{ mb: 2 }}
          >
            Enter your email address and follow the link that will be sent to
            reset your password.
          </Typography>
          <Box
            display={hideForm}
            component="form"
            onSubmit={handleForgotPassword}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              size="small"
              sx={{ mb: 2 }}
              margin="normal"
              required
              fullWidth
              id="email"
              label={
                <Typography variant="small" sx={{ fontSize: "small" }}>
                  Enter your email
                </Typography>
              }
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <ActionButton type="submit" text="continue" />
          </Box>
          <Divider sx={{ mt: 3, mb: 2 }} />
          <Link
            onClick={() => {
              setHideEmailMsg("none");
              setHideForm("");
              setOpenForgotPassworModal(false);
            }}
            sx={{
              cursor: "pointer",
              textTransform: "none",
            }}
            variant="body2"
          >
            Return to PMMS login
          </Link>
          <LoadingBackdrop open={loading} />
        </Box>
      </Modal>
    </div>
  );
};

export default ForgotPassword;
