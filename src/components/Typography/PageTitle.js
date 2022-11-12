import { Box, Typography } from "@mui/material";
import React from "react";

const PageTitle = (props) => {
  return (
    <Box mt={3} mb={2} textAlign={props.textAlign} {...props}>
      <Typography variant="h4" fontWeight={700}>
        {props.title}
      </Typography>
    </Box>
  );
};
PageTitle.defaultProps = {
  title: "Page Title",
};

export default PageTitle;
