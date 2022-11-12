import React, { useEffect, useState } from "react";
import { isSignInWithEmailLink, signOut, updateEmail } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { updateUser } from "../../serverFunctions/auth";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
import LoadingBackdrop from "../../components/Feedbacks/LoadingBackdrop";

const EmailChange = () => {
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailChange = async () => {
    setLoading(true);
    try {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setNewEmail(window.localStorage.getItem("newEmail"));
        let fbUser = auth.currentUser;
        updateEmail(fbUser, newEmail)
          .then(async () => {
            const idTokenResult = await fbUser.getIdTokenResult();
            await updateUser(
              idTokenResult.token,
              { email: newEmail },
              user._id
            ).then(() => {
              //signout user
              signOut(auth)
                .then(() => {
                  setLoading(false);
                  toast.success(
                    "Email changed. Please login with your new email"
                  );
                  dispatch({
                    type: "LOGOUT",
                    payload: null,
                  });
                  navigate("/login");
                  window.localStorage.removeItem("newEmail");
                  setLoading(false);
                })
                .catch((error) => {
                  setLoading(false);
                  console.log(error);
                });
            });
          })
          .catch((error) => {
            error.code !== "auth/user-token-expired" && toast.error(error.code);
            console.log(error);
            setLoading(false);
          });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    setNewEmail(window.localStorage.getItem("newEmail"));
    handleEmailChange();
  }, [handleEmailChange]);

  return (
    <Box>
      <LoadingBackdrop open={loading} />
    </Box>
  );
};

export default EmailChange;
