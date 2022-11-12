import React from "react";
import { Link as RLink } from "react-router-dom";

const Link = (props) => {
  return (
    <>
      <RLink
        to={props.to}
        onClick={props.onClick}
        style={{
          textDecoration: props.textDecoration,
          color: props.color,
          cursor: "pointer",
          textTransform: props.textTransform,
        }}
        {...props}
      >
        {props.text}
      </RLink>
    </>
  );
};

Link.defaultProps = {
  textTransform: "capitalize",
  color: "#da6c57",
  text: "Link text",
  textDecoration: "none",
};
export default Link;
