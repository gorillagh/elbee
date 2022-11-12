import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
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

const ChangePassword = ({ open, closeChangePasswordModal }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [showPassword1Info, setShowPassword1Info] = useState("none");
  const [showPassword2Info, setShowPassword2Info] = useState("none");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (open === false) {
      setNewPassword1("");
      setNewPassword2("");
      setCurrentPassword("");
      setShowPassword1Info("none");
      setShowPassword2Info("none");
    }
  }, [open]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      //handle sign in with password and emal to make sure the current password is correct
      const result = await signInWithEmailAndPassword(
        auth,
        user.email,
        currentPassword
      );
      if (result.user.email === user.email) {
        //update password for the user.
        await updatePassword(result.user, newPassword1)
          .then(() => {
            setNewPassword1("");
            setNewPassword2("");
            setCurrentPassword("");
            signOut(auth)
              .then(() => {
                toast.success(`Password changed. Please login again.`);
                dispatch({
                  type: "LOGOUT",
                  payload: null,
                });
                navigate("/login");
                setLoading(false);
              })
              .catch((error) => {
                setLoading(false);
                toast.error(error.message);
                console.log(error);
              });
          })
          .catch((error) => {
            setLoading(false);
            toast.error(error.message);
            console.log(error);
            return;
          });
      }
    } catch (error) {
      error.code === "auth/wrong-password" &&
        toast.error("The current password you entered is wrong");
      setLoading(false);
      console.log(error.code);
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
            sx={{ fontWeight: "bold", mb: 3 }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Change Password
          </Typography>

          <Box component="form" onSubmit={handleChangePassword} noValidate>
            <TextField
              size="small"
              sx={{ mb: 2 }}
              margin="normal"
              required
              fullWidth
              type="password"
              id="currentPassword"
              label={
                <Typography sx={{ fontSize: "small" }} variant="small">
                  Current Password
                </Typography>
              }
              name="currentPassword"
              autoFocus
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              size="small"
              // sx={{ mb: 2 }}
              margin="normal"
              required
              fullWidth
              type="password"
              id="newPassword1"
              label={
                <Typography sx={{ fontSize: "small" }} variant="small">
                  New Password
                </Typography>
              }
              name="newPassword1"
              value={newPassword1}
              onChange={(e) => {
                setNewPassword1(e.target.value);
                if (
                  e.target.value.match(/[A-Z]/g) &&
                  e.target.value.match(/[0-9]/g) &&
                  e.target.value.match(/[a-z]/g) &&
                  e.target.value.length >= 8
                ) {
                  setShowPassword1Info("none");
                } else setShowPassword1Info("");
              }}
            />
            <Typography
              display={showPassword1Info}
              sx={{ mb: 3, fontSize: "0.65rem" }}
              color="red"
              component="small"
              variant="small"
            >
              Must contain at least one number and one uppercase and lowercase
              letter, and at least 8 or more characters
            </Typography>
            <TextField
              size="small"
              // sx={{ mb: 2 }}
              margin="normal"
              required
              fullWidth
              type="password"
              id="newPassword2"
              label={
                <Typography sx={{ fontSize: "small" }} variant="small">
                  Confirm Password
                </Typography>
              }
              name="newPassword2"
              value={newPassword2}
              onChange={(e) => {
                setNewPassword2(e.target.value);

                if (
                  e.target.value === newPassword1 ||
                  e.target.value.length < 1
                ) {
                  setShowPassword2Info("none");
                } else setShowPassword2Info("");
              }}
            />
            <Typography
              display={showPassword2Info}
              sx={{ mb: 3, fontSize: "0.65rem" }}
              color="red"
              component="small"
              variant="small"
            >
              Must match the new password
            </Typography>
            <Grid sx={{ mt: 3 }} container spacing={2}>
              <Grid item xs={6}>
                <ActionButton
                  variant="outlined"
                  text="cancel"
                  onClick={closeChangePasswordModal}
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

export default ChangePassword;
