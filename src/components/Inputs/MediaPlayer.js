import React from "react";
import ReactPlayer from "react-player";

const MediaPlayer = (props) => {
  console.log("url---->", props.url);

  return (
    <div>
      <ReactPlayer url={props.url} controls={true} />
    </div>
  );
};

export default MediaPlayer;
