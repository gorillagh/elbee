import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import { toast } from "react-toastify";
import ForgotPassword from "../../components/PopUps/ForgotPassword";
import { googleLogin, loginUser } from "../../serverFunctions/auth";
import Icon from "@mui/material/Icon";
import googleSignInIcon from "../../images/googleSignin.svg";
import LoadingBackdrop from "../../components/Feedbacks/LoadingBackdrop";
import Link from "../../components/Links/Link";
import ActionButton from "../../components/Buttons/ActionButton";
import PageTitle from "../../components/Typography/PageTitle";
import { Card } from "@mui/material";
import Subtitle from "../../components/Typography/Subtitle";

const provider = new GoogleAuthProvider();

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [openForgotPasswordModal, setOpenForgotPassworModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => ({ ...state }));

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.error("Enter your email!");
      return;
    }
    if (!password) {
      toast.error("Enter your password");
      return;
    }

    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      loginUser(idTokenResult.token)
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
      console.log(error.code);
      if (error.code === "auth/user-not-found") {
        toast.error("Email address not registered. Please sign up!");
      } else {
        toast.error(error.message);
      }

      setLoading(false);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        {/* <CssBaseline /> */}
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
          <PageTitle title="Log In" />
          {/* <Subtitle title="Log In" /> */}
          <ActionButton
            color="secondary"
            onClick={googleSignIn}
            text={
              <>
                <Icon sx={{ mr: 2 }}>
                  {" "}
                  <img src={googleSignInIcon} />{" "}
                </Icon>
                With Google
              </>
            }
            backgroundColor="#E34133"
          />

          <Typography
            sx={{ my: 1 }}
            variant="body2"
            color="text.secondary"
            align="center"
          >
            OR
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <ActionButton type="submit" onClick={handleSubmit} text="Log In" />

            <Box align="center" sx={{ mt: 2 }}>
              <Link
                onClick={() => setOpenForgotPassworModal(true)}
                text="Forgot Password"
                textDecoration="underline"
              />
            </Box>
            <Divider sx={{ mt: 3 }} />
            <Box align="center" sx={{ mt: 2 }}>
              <Link to="/signup" text="Sign Up" textDecoration="underline" />
            </Box>
          </Box>
        </Card>
        <ForgotPassword
          openForgotPasswordModal={openForgotPasswordModal}
          email={email}
          setEmail={setEmail}
          setOpenForgotPassworModal={setOpenForgotPassworModal}
        />
        <LoadingBackdrop open={loading} />
      </Container>
    </>
  );
};

export default Login;
