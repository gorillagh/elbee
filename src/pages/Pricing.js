import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Container from "@mui/material/Container";
import PageTitle from "../components/Typography/PageTitle";
import Subtitle from "../components/Typography/Subtitle";
import ActionButton from "../components/Buttons/ActionButton";
import { useNavigate } from "react-router-dom";

const tiers = [
  {
    title: "Transcription",
    price: "1",
    description: ["Video & Audio"],
    to: "/order/transcription",
  },
  {
    title: "Captioning",
    price: "1.5",
    description: ["Video"],
    to: "/order/captioning",
  },
  {
    title: "Translation",
    price: "2.5",
    description: ["Video & Audio"],
    to: "/order/translation",
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Hero unit */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pb: 6 }}>
        <PageTitle title="Pricing" textAlign="center" />
        <Typography variant="body1" align="center" color="text.secondary">
          We charge per minute of audio/video files.
        </Typography>
      </Container>
      {/* End hero unit */}
      <Grid container spacing={3} alignItems="flex-end">
        {tiers.map((tier) => (
          // Enterprise card is full width at sm breakpoint
          <Grid item key={tier.title} xs={12} sm={6} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title={<Subtitle title={tier.title} />}
                subheader={tier.subheader}
                titleTypographyProps={{ align: "center" }}
                subheaderTypographyProps={{
                  align: "center",
                }}
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                      ? theme.palette.grey[200]
                      : theme.palette.grey[700],
                }}
              />
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                    mb: 2,
                  }}
                >
                  <Typography component="h2" variant="h3" color="text.primary">
                    ${tier.price}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    /min
                  </Typography>
                </Box>

                {tier.description.map((line) => (
                  <Typography variant="body1" align="center" key={line}>
                    {line}
                  </Typography>
                ))}
              </CardContent>
              <CardActions>
                <ActionButton
                  my={0}
                  text="Order Now"
                  onClick={() => navigate(tier.to)}
                />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* </Container> */}
    </>
  );
};

export default Pricing;
