import React from "react";
import Button from "@mui/material/Button";

const ActionButton = (props) => {
  return (
    <Button
      type={props.type}
      fullWidth
      variant={props.variant}
      color={props.color}
      size={props.size}
      onClick={props.onClick}
      sx={{
        my: props.my,
        borderRadius: 5,
        textTransform: "capitalize",
        color: props.variant !== "contained" ? "" : "#fff",
        backgroundColor: props.backgroundColor,
        "&:hover": {
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
        },
      }}
      {...props}
    >
      {props.text}
    </Button>
  );
};

ActionButton.defaultProps = {
  my: 3,
  variant: "contained",
  color: "primary",
  size: "large",
  onClick: () => {
    console.log("Button Clicked");
  },
};

export default ActionButton;
