import * as React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const NavbarButton = (props) => {
  return (
    <Link to={props.href} style={{ textDecoration: "none" }}>
      <Button
        variant={props.variant}
        //   href={props.href}
        color={props.color}
        size={props.size}
        sx={{
          borderRadius: 6,
          mx: 1,
          textTransform: "capitalize",
          textDecoration: "none",
        }}
        onClick={props.onClick}
      >
        {props.text}
      </Button>
    </Link>
  );
};

NavbarButton.defaultProps = {
  variant: "contained",
  color: "primary",
  size: "medium",
};

export default NavbarButton;
