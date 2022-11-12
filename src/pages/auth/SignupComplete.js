import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../../firebase";
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import { createOrUpdateUser } from "../../serverFunctions/auth";
import LoadingBackdrop from "../../components/Feedbacks/LoadingBackdrop";
import PageTitle from "../../components/Typography/PageTitle";
import ActionButton from "../../components/Buttons/ActionButton";
import Link from "../../components/Links/Link";

const SignupComplete = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword1Info, setShowPassword1Info] = useState("");
  const [showPassword2Info, setShowPassword2Info] = useState("none");

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (window.localStorage.getItem("eBSignupEmail")) {
      setEmail(window.localStorage.getItem("eBSignupEmail"));
    } else {
      setEmailAvailable(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!firstName || !lastName) {
        toast.error("Please fill out your name");
        return;
      }
      if (!/^[0-9]+$/.test(phoneNumber) || phoneNumber.length < 9) {
        toast.error("Please enter a valid phone number.");
        setLoading(false);
        return;
      }
      if (password1 !== password2) {
        toast.error("Passwords must match!");
        return;
      }
      if (
        !password1.match(/[A-Z]/g) ||
        !password1.match(/[0-9]/g) ||
        !password1.match(/[a-z]/g) ||
        password1.length < 8
      ) {
        toast.error("Passwords must be in the right format");
        return;
      }

      setLoading(true);

      if (isSignInWithEmailLink(auth, window.location.href)) {
        // let email = window.localStorage.getItem("signupEmail");
        // if (!email) {
        //   email = window.prompt("Please provide your email for confirmation");
        // }
        const result = await signInWithEmailLink(
          auth,
          email,
          window.location.href
        );
        if (result.user.emailVerified) {
          window.localStorage.removeItem("eBSignupEmail");
          let fbUser = auth.currentUser;

          await updatePassword(fbUser, password1);

          await updateProfile(fbUser, {
            displayName: `${firstName} ${lastName}`,
          });
          const name = `${firstName} ${lastName}`;
          const idTokenResult = await fbUser.getIdTokenResult();
          createOrUpdateUser(idTokenResult.token, phoneNumber, name)
            .then((res) => {
              console.log(res.data);
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
              console.log(error.message);
            });
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
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

          <Typography sx={{ mt: 2 }} component="h3" variant="h5">
            Almost done!
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled={emailAvailable}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  value={phoneNumber}
                  fullWidth
                  label="Phone"
                  id="outlined-start-adornment"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+233</InputAdornment>
                    ),
                  }}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password1"
                  label="Password"
                  type="password"
                  id="password1"
                  autoComplete="new-password"
                  value={password1}
                  onChange={(e) => {
                    setPassword1(e.target.value);
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
                  Must contain at least one number and one uppercase and
                  lowercase letter, and at least 8 or more characters
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password2"
                  label="Re-enter Password"
                  type="password"
                  title="Must match the above password"
                  id="password2"
                  autoComplete="new-password"
                  value={password2}
                  onChange={(e) => {
                    setPassword2(e.target.value);
                    if (
                      e.target.value === password1 ||
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
                  Must match the first password
                </Typography>
              </Grid>
            </Grid>

            <ActionButton type="Submit" onClick={handleSubmit} text="Sign Up" />

            <Divider sx={{ mt: 3 }} />

            <Box align="center" sx={{ mt: 2 }}>
              <Link
                to="/login"
                text="Login Instead"
                textDecoration="underline"
              />
            </Box>
          </Box>
        </Box>
        <LoadingBackdrop open={loading} />
      </Container>
    </>
  );
};

export default SignupComplete;
