import React from "react";
import { Box, Typography } from "@mui/material";

import { useDropzone } from "react-dropzone";
import ActionButton from "../Buttons/ActionButton";
import MediaPlayer from "./MediaPlayer";
const DragAndDropZone = ({
  onDrop,
  open,
  getUploadParams,
  onChangeStatus,
  onSubmit,
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    accept: {
      "audio/*": [],
      "video/*": [],
    },
    maxSize: 5368709120,
    onDrop,
    getUploadParams,
    onChangeStatus,
    onSubmit,
  });
  const acceptedFileItems = acceptedFiles.map((file) => (
    // <MediaPlayer url={file} />
    <li key={file.path}>
      {JSON.stringify(file)}
      {file.path} - {file.size} bytes
    </li>
  ));
  const rejectedFileItems = fileRejections.map((file) => (
    <li key={file.path}>
      {JSON.stringify(file)}
      {file.path} - {file.size} bytes
    </li>
  ));
  return (
    <>
      <Box
        {...getRootProps()}
        sx={{
          border: isDragActive ? "2px dashed #da6c57" : "2px dashed #c8c8c8",
          display: { xs: "none", md: "block" },
          "&:hover": {
            cursor: "pointer",
            border: "2px dashed #da6c57",
          },
        }}
        p={1}
      >
        <input className="input-zone" {...getInputProps()} />
        <Box>
          {isDragActive ? (
            <Typography align="center" variant="body2" my={3}>
              Drop the file(s) here
            </Typography>
          ) : (
            <Typography align="center" variant="body2" my={3}>
              Drag’ n’ drop some files here, or click to select files
            </Typography>
          )}

          <ActionButton
            variant="outlined"
            text="Click to select files"
            onClick={open}
            my={0}
          />
        </Box>
      </Box>
      <aside>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
        <h4>Rejected files</h4>
        <ul>{rejectedFileItems}</ul>
      </aside>
    </>
  );
};
export default DragAndDropZone;
