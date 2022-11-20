import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import ActionButton from "../components/Buttons/ActionButton";
import PageTitle from "../components/Typography/PageTitle";
import CheckIcon from "@mui/icons-material/Check";
import hero from "../images/hero1.webp";
import hero2 from "../images/hero2.png";
import hero3 from "../images/hero3.png";
import ChooseOrderType from "../components/PopUps/ChooseOrderType";

const heroItems = ["99.9% Accurate", "On time Delivery", "At reasonable cost"];

const Home = () => {
  const [openChooseOrderType, setOpenChooseOrderType] = useState(false);
  const navigate = useNavigate();

  return (
    <Box>
      <Grid
        alignItems="center"
        direction="row"
        justifyContent="center"
        container
      >
        <Grid item md={6}>
          <Box width="80%">
            <PageTitle title="Get your audio and video in text..." />
            {heroItems.map((item, index) => {
              return (
                <List sx={{ py: 0 }} key={index}>
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <CheckIcon sx={{ color: "#784af4" }} />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                </List>
              );
            })}
            <Grid container>
              <Grid item xs={12} md={6}>
                <ActionButton
                  text="Place An Order"
                  onClick={() => setOpenChooseOrderType(true)}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid justifyContent="center" item md={6}>
          <Box>
            <img src={hero3} alt="hero" width="100%" />
          </Box>
        </Grid>
      </Grid>
      <ChooseOrderType
        open={openChooseOrderType}
        closeModal={() => setOpenChooseOrderType(false)}
      />
    </Box>
  );
};

export default Home;
