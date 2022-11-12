import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import {
  sendSignInLinkToEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import {
  checkEmailAvailability,
  googleLogin,
} from "../../serverFunctions/auth";
import googleSignInIcon from "../../images/googleSignin.svg";
import LoadingBackdrop from "../../components/Feedbacks/LoadingBackdrop";
import PageTitle from "../../components/Typography/PageTitle";
import ActionButton from "../../components/Buttons/ActionButton";
import Link from "../../components/Links/Link";
import { Card } from "@mui/material";

const provider = new GoogleAuthProvider();

const Signup = () => {
  const [email, setEmail] = useState("");
  const [hideForm, setHideForm] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [hideEmailMsg, setHideEmailMsg] = useState("none");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const roleBasedRedirect = (user) => {
    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/my/dashboard");
    }
  };

  useEffect(() => {
    if (user && user.token) roleBasedRedirect(user);
  });

  const googleSignIn = async () => {
    try {
      setLoading(true);

      // await signInWithRedirect(auth, provider);
      // const result = await getRedirectResult(auth);
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      googleLogin(idTokenResult.token)
        .then((res) => {
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
          roleBasedRedirect(res.data);
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

  const handleSubmit = async (e) => {
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

      // if (!/^[0-9]+$/.test(phoneNumber) || phoneNumber.length < 9) {
      //   toast.error("Please enter a valid phone number.");
      //   setLoading(false);
      //   setPhoneError(true);
      //   return;
      // }

      const config = {
        url: process.env.REACT_APP_SIGNUP_REDIRECT_URL,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, config);

      window.localStorage.setItem("eBSignupEmail", email);
      toast.success(`Verificaton link sent to ${email}.`);
      setEmail("");
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
    <>
      <Container component="main" maxWidth="xs">
        <Card
          sx={{
            m: 1,
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "16px",
            background: " rgba(255, 255, 255, 0.9)",
            webkitBackdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.9)",
          }}
        >
          <PageTitle title="Sign Up" />

          <Typography
            display={hideEmailMsg}
            sx={{ mt: 2 }}
            component="small"
            variant="small"
          >
            Click on the link sent to{" "}
            <Link textDecoration="none" text={emailMsg} /> to continue signing
            up...
          </Typography>
          <Typography
            display={hideEmailMsg}
            sx={{ mt: 2 }}
            component="small"
            variant="small"
          >
            made a mistake?{" "}
            <Link
              onClick={() => {
                setHideEmailMsg("none");
                setHideForm("");
              }}
              text="Re-enter details"
            />
          </Typography>

          <Box
            display={hideForm}
            component="form"
            noValidate
            onSubmit={handleSubmit}
          >
            <ActionButton
              color="secondary"
              onClick={googleSignIn}
              text={
                <>
                  <Icon sx={{ mr: 2 }}>
                    {" "}
                    <img src={googleSignInIcon} />{" "}
                  </Icon>
                  Join with Google
                </>
              }
              backgroundColor="#E34133"
            />
            <Typography
              sx={{ my: 3 }}
              variant="body2"
              color="text.secondary"
              align="center"
            >
              OR
            </Typography>

            <TextField
              error={emailError}
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <ActionButton
              type="submit"
              onClick={handleSubmit}
              text="Continue"
            />

            <Divider sx={{ mt: 3 }} />

            <Box align="center" sx={{ mt: 2 }}>
              <Link
                to="/login"
                text="Login Instead"
                textDecoration="underline"
              />
            </Box>
          </Box>
        </Card>
        <LoadingBackdrop open={loading} />
      </Container>
    </>
  );
};

export default Signup;
