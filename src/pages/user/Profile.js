import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Button,
  Container,
  Divider,
  Icon,
  IconButton,
  Skeleton,
} from "@mui/material";
import ChangePassword from "../../components/PopUps/ChangePassword";
import { toast } from "react-toastify";
import ChangeName from "../../components/PopUps/ChangeName";
import ChangePhone from "../../components/PopUps/ChangePhone";
import { currentUser } from "../../serverFunctions/auth";
import ChangeEmail from "../../components/PopUps/ChangeEmail";
import PageTitle from "../../components/Typography/PageTitle";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, m: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Profile = () => {
  const [value, setValue] = useState(0);
  const [dbUser, setDbUser] = useState({});
  const [dbUserLoading, setDbUserLoading] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [openChangeNameModal, setOpenChangeNameModal] = useState(false);
  const [openChangeEmailModal, setOpenChangeEmailModal] = useState(false);
  const [openChangePhoneModal, setOpenChangePhoneModal] = useState(false);

  var { user } = useSelector((state) => ({ ...state }));

  const fetchUser = () => {
    setDbUserLoading(true);
    currentUser(user.token)
      .then((res) => {
        setDbUser(res.data);
        setDbUserLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUser();
  }, [user]);

  const handleChangeEmail = async () => {
    setOpenChangeEmailModal(true);
  };
  const handleChangeName = async () => {
    setOpenChangeNameModal(true);
  };
  const handleChangePhone = async () => {
    setOpenChangePhoneModal(true);
  };
  const handleChangePassword = async () => {
    setOpenChangePasswordModal(true);
  };

  const loginAndSecurityData = [
    { description: "Email", content: dbUser.email, action: handleChangeEmail },
    {
      description: "Phone",
      content: dbUser.phoneNumber,
      action: handleChangePhone,
    },
    {
      description: "Password",
      content: "• • • • • • • • • •",
      action: handleChangePassword,
    },
  ];

  const personalInformationData = [
    { description: "Name", content: dbUser.name, action: handleChangeName },
    {
      description: "Email",
      content: dbUser.email,
      action: handleChangeEmail,
    },
    {
      description: "Phone",
      content: dbUser.phoneNumber,
      action: handleChangePhone,
    },
  ];

  const VerticalTabs = () => {
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      // <Container maxWidth="lg" sx={{ display: { xs: "none", md: "block" } }}>
      <Box
        sx={{
          m: 1,
          p: 2,
          borderRadius: "16px",
          background: " rgba(255, 255, 255, 0.9)",
          webkitBackdropFilter: "blur(5px)",
          border: "1px solid rgba(255, 255, 255, 0.9)",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,

            display: { md: "flex" },

            // height: "50vh",
            margin: "10px auto",
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            <Tab
              sx={{ textTransform: "none" }}
              label="Login and Security"
              {...a11yProps(0)}
            />
            <Tab
              sx={{ textTransform: "none" }}
              label="Personal Information"
              {...a11yProps(1)}
            />
          </Tabs>
          <Box width="20px" />
          <Box width="80%">
            <TabPanel value={value} index={0}>
              <Typography variant="h6">Login and Security</Typography>
              <Divider sx={{ my: 3 }} />

              {loginAndSecurityData.map((value, index) => (
                <div key={index}>
                  <Box display="flex">
                    <Typography
                      sx={{ width: "30%", fontWeight: "500", flexGrow: 1 }}
                    >
                      {value.description}
                    </Typography>
                    <Typography sx={{ width: "30%", flexGrow: 1 }}>
                      {dbUserLoading ? (
                        <Skeleton sx={{ width: "80%" }} />
                      ) : value.content === null || value.content === "" ? (
                        "_____"
                      ) : (
                        value.content
                      )}
                    </Typography>
                    <Typography
                      align="right"
                      sx={{ width: "30%", flexGrow: 1 }}
                    >
                      {!dbUserLoading && (
                        <IconButton
                          disabled={value.description === "Email"}
                          onClick={value.action}
                          variant="outlined"
                        >
                          {value.content === null || value.content === "" ? (
                            <Icon
                              sx={{
                                color:
                                  value.description === "Email"
                                    ? ""
                                    : "#0F7AE7",
                              }}
                              fontSize="small"
                            >
                              add
                            </Icon>
                          ) : (
                            <Icon
                              sx={{
                                color:
                                  value.description === "Email"
                                    ? ""
                                    : "#0F7AE7",
                              }}
                              fontSize="small"
                            >
                              edit
                            </Icon>
                          )}
                        </IconButton>
                      )}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 3 }} />
                </div>
              ))}
            </TabPanel>

            <TabPanel value={value} index={1}>
              <Typography variant="h6">Personal Information</Typography>
              <Divider sx={{ my: 3 }} />
              {personalInformationData.map((value, index) => (
                <div key={index}>
                  <Box display="flex">
                    <Typography
                      sx={{ width: "30%", fontWeight: "500", flexGrow: 1 }}
                    >
                      {value.description}
                    </Typography>
                    <Typography
                      sx={{
                        width: "30%",
                        flexGrow: 1,
                        textTransform:
                          value.content === dbUser.name ? "capitalize" : "none",
                      }}
                    >
                      {dbUserLoading ? (
                        <Skeleton sx={{ width: "80%" }} />
                      ) : value.content === null || value.content === "" ? (
                        "none"
                      ) : (
                        value.content
                      )}
                    </Typography>
                    <Typography
                      align="right"
                      sx={{ width: "30%", flexGrow: 1 }}
                    >
                      {!dbUserLoading && (
                        <IconButton
                          disabled={value.description === "Email"}
                          onClick={value.action}
                          variant="outlined"
                        >
                          {value.content === null || value.content === "" ? (
                            <Icon
                              sx={{
                                color:
                                  value.description === "Email"
                                    ? ""
                                    : "#0F7AE7",
                              }}
                              fontSize="small"
                            >
                              add
                            </Icon>
                          ) : (
                            <Icon
                              sx={{
                                color:
                                  value.description === "Email"
                                    ? ""
                                    : "#0F7AE7",
                              }}
                              fontSize="small"
                            >
                              edit
                            </Icon>
                          )}
                        </IconButton>
                      )}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 3 }} />
                </div>
              ))}
            </TabPanel>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <PageTitle textAlign="center" title="My Profile" />
      <VerticalTabs />
      <ChangePassword
        open={openChangePasswordModal}
        closeChangePasswordModal={() => setOpenChangePasswordModal(false)}
      />
      <ChangeName
        open={openChangeNameModal}
        closeModal={() => setOpenChangeNameModal(false)}
        fetchUser={fetchUser}
      />
      <ChangePhone
        open={openChangePhoneModal}
        closeModal={() => setOpenChangePhoneModal(false)}
        fetchUser={fetchUser}
      />
      <ChangeEmail
        open={openChangeEmailModal}
        closeModal={() => setOpenChangeEmailModal(false)}
        fetchUser={fetchUser}
      />
    </Box>
  );
};

export default Profile;
