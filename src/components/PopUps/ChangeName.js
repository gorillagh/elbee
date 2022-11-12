import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { updateProfile } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { updateUser } from "../../serverFunctions/auth";
import { Grid } from "@mui/material";
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

const ChangeName = ({ open, closeModal, fetchUser }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFirstName(user.name.split(" ")[0]);
    setLastName(user.name.split(" ")[1]);
    if (open === false) {
      setFirstName("");
      setLastName("");
    }
  }, [user.name, open]);

  const handleChangeName = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newName = `${firstName} ${lastName}`;

      //Update name in firebase
      await updateProfile(auth.currentUser, {
        displayName: newName,
      });
      //Update name in backend
      await updateUser(user.token, { name: newName }, user._id)
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
          closeModal();
          toast.success(`Named changed to ${newName}`);
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
            Change Your Name
          </Typography>

          <Box
            component="form"
            onSubmit={handleChangeName}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              size="small"
              sx={{ mb: 2 }}
              margin="normal"
              required
              fullWidth
              id="firstName"
              label={
                <Typography sx={{ fontSize: "small" }} variant="small">
                  First Name
                </Typography>
              }
              name="firstName"
              autoFocus
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              size="small"
              sx={{ mb: 2 }}
              margin="normal"
              required
              fullWidth
              id="lastName"
              label={
                <Typography sx={{ fontSize: "small" }} variant="small">
                  Last Name
                </Typography>
              }
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <Grid sx={{ mt: 3 }} container spacing={2}>
              <Grid item xs={6}>
                <ActionButton
                  text="cancel"
                  onClick={closeModal}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={6}>
                {" "}
                <ActionButton type="submit" text="Save" />
              </Grid>
            </Grid>
          </Box>
          <LoadingBackdrop open={loading} />
        </Box>
      </Modal>
    </div>
  );
};

export default ChangeName;
