import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import InputAdornment from "@mui/material/InputAdornment";

import { updateUser } from "../../serverFunctions/auth";
import { Link } from "@mui/material";
import LoadingBackdrop from "../Feedbacks/LoadingBackdrop";
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

const ChangePhone = ({ open, closeModal, fetchUser }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [hideForm, setHideForm] = useState("");
  const [phoneMsg, setPhoneMsg] = useState("");
  const [hidePhoneMsg, setHidePhoneMsg] = useState("none");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPhoneNumber(user.phoneNumber.slice(-9));
    if (open === false) {
      setPhoneNumber(user.phoneNumber.slice(-9));
      setHideForm("");
      setPhoneMsg("");
      setHidePhoneMsg("none");
    }
  }, [user, open]);

  const handleChangePhone = async (e) => {
    e.preventDefault();
    console.log(phoneNumber.match(/[0-9]/g));
    if (!/^[0-9]+$/.test(phoneNumber) || phoneNumber.length < 9) {
      toast.error("Please enter a valid phone number.");
      setLoading(false);
      setPhoneError(true);
      return;
    }
    try {
      setLoading(true);

      //sendVerifcation to user

      //Update phone number in backend
      await updateUser(
        user.token,
        { phoneNumber: `+233${phoneNumber.slice(-9)}` },
        user._id
      )
        .then((res) => {
          fetchUser();
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              email: res.data.email,
              role: res.data.role,
              name: res.data.name,
              token: auth.currentUser.stsTokenManager.accessToken,
              phoneNumber: res.data.phoneNumber ? res.data.phoneNumber : "",
              _id: res.data._id,
            },
          });
          setPhoneNumber("");
          setPhoneMsg(phoneNumber);
          setHideForm("none");
          setHidePhoneMsg("");
          toast.success(`Phone number changed to +233${phoneNumber}`);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.message);
          console.log(error);
        });
    } catch (error) {
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
            sx={{ fontWeight: "bold", mb: 3 }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Update Phone Number
          </Typography>
          <Box display={hidePhoneMsg}>
            <Typography sx={{ mb: 1 }} component="p" variant="p">
              Enter the code sent to{" "}
              <Link sx={{ fontWeight: "bold" }} underline="none">
                {" "}
                +233 {phoneMsg.slice(-9)}
              </Link>{" "}
            </Typography>
            <Box sx={{ mb: 3, width: "40%" }}>
              <TextField size="small" autoFocus />
            </Box>

            <Typography sx={{ mt: 2, fontSize: "small" }} variant="small">
              {" "}
              <Link
                onClick={() => {
                  setHidePhoneMsg("none");
                  setHideForm("");
                }}
                sx={{ cursor: "pointer", color: "#0F7AE7" }}
              >
                Resend Code?
              </Link>
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
            onSubmit={handleChangePhone}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              size="small"
              sx={{ mb: 2 }}
              error={phoneError}
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              label={
                <Typography variant="small" sx={{ fontSize: "small" }}>
                  Phone
                </Typography>
              }
              id="outlined-start-adornment"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+233</InputAdornment>
                ),
              }}
            />
            <Box sx={{ mb: 3 }}>
              <Typography variant="small" sx={{ fontSize: "small" }}>
                A verificaton code will be sent to this phone number
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

export default ChangePhone;
