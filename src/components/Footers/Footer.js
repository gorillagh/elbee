import React from "react";
import Typography from "@mui/material/Typography";
import Link from "../Links/Link";
import { Container, Divider, Grid } from "@mui/material";

const footers = [
  {
    title: "Company",
    description: ["Team", "About", "Contact us", "Locations"],
  },
  {
    title: "Services",
    description: [
      "Audio to text",
      "Video to text",
      "On-screen subtitle",
      "Video subtitle translation",
    ],
  },

  {
    title: "Legal",
    description: ["Privacy policy", "Terms & conditions"],
  },
];

const Footer = (props) => {
  return (
    <>
      <Divider sx={{ mt: 10, mb: 3 }} />
      <Grid container spacing={4} justifyContent="left">
        {footers.map((footer) => (
          <Grid item xs={6} sm={4} key={footer.title}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {footer.title}
            </Typography>
            {footer.description.map((item) => (
              <Typography variant="body2" lineHeight={2}>
                <Link text={item} />
              </Typography>
            ))}
          </Grid>
        ))}
      </Grid>
      {/* </Container> */}
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ my: 4 }}
      >
        {"© "}
        <Link text="Elbee" to="/" /> {new Date().getFullYear()}
        {"."}
      </Typography>
    </>
  );
};

export default Footer;
