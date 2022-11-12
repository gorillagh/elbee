import { Box, Typography } from "@mui/material";
import React from "react";

const Subtitle = (props) => {
  return (
    <Box mt={3} mb={2} textAlign={props.textAlign}>
      <Typography variant="h5" fontWeight={500} {...props}>
        {props.title}
      </Typography>
    </Box>
  );
};
Subtitle.defaultProps = {
  title: "Sub Title",
};

export default Subtitle;
