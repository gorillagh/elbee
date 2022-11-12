import { Box, Typography } from "@mui/material";
import React from "react";
import PageTitle from "../../components/Typography/PageTitle";
import Subtitle from "../../components/Typography/Subtitle";

const FileSubmission = () => {
  return (
    <Box>
      <PageTitle title="Add file" />
      <Typography variant="body1">
        Get started by uploading or giving us a link to your audio or video file
      </Typography>
    </Box>
  );
};

export default FileSubmission;
