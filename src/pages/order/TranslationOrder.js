import { Box, Typography } from "@mui/material";
import React from "react";
import PageTitle from "../../components/Typography/PageTitle";

const TranslationOrder = () => {
  return (
    <Box>
      <PageTitle title="Translation" />
      <Typography variant="body1">
        Get started by uploading or giving us a link to your audio or video file
      </Typography>
    </Box>
  );
};

export default TranslationOrder;
