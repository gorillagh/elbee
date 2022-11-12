import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { sendSignInLinkToEmail } from "firebase/auth";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import { checkEmailAvailability } from "../../serverFunctions/auth";
import LoadingBackdrop from "../Feedbacks/LoadingBackdrop";
import Link from "../Links/Link";
import ActionButton from "../Buttons/ActionButton";

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

const ChangeEmail = ({ open, closeModal, fetchUser }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [email, setEmail] = useState("");
  const [hideForm, setHideForm] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [hideEmailMsg, setHideEmailMsg] = useState("none");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    setEmail(user.email);
    if (open === false) {
      setEmail(user.email);
      setHideForm("");
      setEmailMsg("");
      setHideEmailMsg("none");
    }
  }, [user.email, open]);

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const availability = await checkEmailAvailability(email);
      setEmailError(false);
      if (availability.data === null) {
        setLoading(false);
        toast.error("This email has already been used!");
        setEmailError(true);
        return;
      }
      const config = {
        url: process.env.REACT_APP_CHANGE_EMAIL_REDIRECT_URL,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, config);
      window.localStorage.setItem("newEmail", email);
      toast.success(`Verificaton link sent to ${email}.`);
      setEmail("");
      setEmailMsg(email);
      setHideForm("none");
      setHideEmailMsg("");
      setLoading(false);
    } catch (error) {
      setEmailError(true);
      toast.error(error.message);
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            Change Email
          </Typography>
          <Box display={hideEmailMsg}>
            <Typography sx={{ mb: 3 }} component="p" variant="p">
              Click on the link sent to{" "}
              <Link textDecoration="none" text={emailMsg} /> to change your
              email. <br /> You will be asked to login again!
            </Typography>
            <Typography sx={{ mt: 2, fontSize: "small" }} variant="small">
              made a mistake?{" "}
              <Link
                onClick={() => {
                  setHideEmailMsg("none");
                  setHideForm("");
                }}
                text="Re-enter email"
              />
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                flexGrow: 1,
                mt: 3,
                mb: 2,
                mr: 2,
                textTransform: "capitalize",
                borderRadius: 6,
              }}
              onClick={closeModal}
            >
              close
            </Button>
          </Box>

          <Box
            display={hideForm}
            component="form"
            onSubmit={handleChangeEmail}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              size="small"
              sx={{ mb: 2 }}
              error={emailError}
              margin="normal"
              required
              fullWidth
              id="newEmail"
              label={
                <Typography variant="small" sx={{ fontSize: "small" }}>
                  New Email
                </Typography>
              }
              name="newEmail"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Box sx={{ mb: 3 }}>
              <Typography variant="small" sx={{ fontSize: "small" }}>
                A verificaton link will be sent to this email
              </Typography>
            </Box>

            <Grid sx={{ mt: 3 }} container spacing={2}>
              <Grid item xs={6}>
                <ActionButton
                  variant="outlined"
                  text="cancel"
                  onClick={closeModal}
                />
              </Grid>

              <Grid item xs={6}>
                <ActionButton type="submit" text="continue" />
              </Grid>
            </Grid>
          </Box>

          <LoadingBackdrop open={loading} />
        </Box>
      </Modal>
    </div>
  );
};

export default ChangeEmail;
