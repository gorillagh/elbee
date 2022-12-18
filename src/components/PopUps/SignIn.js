import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { Box, Grid, Icon, Typography } from "@mui/material";
import Subtitle from "../Typography/Subtitle";
import ActionButton from "../Buttons/ActionButton";
import googleSignInIcon from "../../images/googleSignin.svg";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { googleLogin } from "../../serverFunctions/auth";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoadingBackdrop from "../Feedbacks/LoadingBackdrop";
import { saveOrderToDb } from "../../serverFunctions/order";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 400,
  minWidth: 250,
  bgcolor: "background.paper",
  //   border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "12px",
  p: 2,
};

const provider = new GoogleAuthProvider();

const SignIn = (props) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => ({ ...state }));

  const googleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      googleLogin(idTokenResult.token)
        .then(async (res) => {
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              email: res.data.email,
              role: res.data.role,
              name: res.data.name,
              token: idTokenResult.token,
              phoneNumber: res.data.phoneNumber ? res.data.phoneNumber : "",
              _id: res.data._id,
            },
          });
          toast.success(
            `Welcome ${res.data.name.slice(0, res.data.name.indexOf(" "))}`
          );
          let userOrder = props.order;
          userOrder.userId = await res.data._id;
          await saveOrderToDb(userOrder);
          navigate(`/payment/transcription/${props.order.id}`);
          props.close();
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      if (error.message === "Firebase: Error (auth/popup-closed-by-user).") {
        toast.error("Google sign in cancelled!");
        setLoading(false);
        return;
      }
      console.log(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };
  const handleGuest = async () => {
    setLoading(true);
    await saveOrderToDb(props.order);
    navigate(`/payment/transcription/${props.order.id}`);
    props.close();
    setLoading(false);
  };

  return (
    <div>
      <Modal
        open={props.open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box component="form" noValidate>
            <Grid container justifyContent="right">
              <Grid item xs={1}>
                <Icon
                  color="error"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    props.close();
                    dispatch({
                      type: "STEPPER",
                      payload: 0,
                    });
                  }}
                >
                  cancel
                </Icon>
              </Grid>
            </Grid>
            <Subtitle
              title="Sign in or sign up to continue"
              textAlign="center"
            />
            <Grid container justifyContent="center">
              <Grid item xs={12}>
                <ActionButton
                  variant="outlined"
                  color="primary"
                  onClick={googleSignIn}
                  text={
                    <>
                      <Icon sx={{ mr: 2 }}>
                        {" "}
                        <img alt="google" src={googleSignInIcon} />{" "}
                      </Icon>
                      With Google
                    </>
                  }
                  backgroundColor="#fff"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography color="text.secondary" align="center">
                  OR
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <ActionButton text="Continue as guest" onClick={handleGuest} />
              </Grid>
            </Grid>
          </Box>
          <LoadingBackdrop open={loading} />
        </Box>
      </Modal>
    </div>
  );
};

export default SignIn;
