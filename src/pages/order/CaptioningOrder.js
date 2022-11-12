import { Box, Typography } from "@mui/material";
import React from "react";
import PageTitle from "../../components/Typography/PageTitle";

const CaptioningOrder = () => {
  return (
    <Box>
      <PageTitle title="Captioning" />
      <Typography variant="body1">
        Get started by uploading or giving us a link to your video file
      </Typography>
    </Box>
  );
};

export default CaptioningOrder;
