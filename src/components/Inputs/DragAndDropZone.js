import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";

import { useDropzone } from "react-dropzone";
import ActionButton from "../Buttons/ActionButton";
import MediaPlayer from "./MediaPlayer";
import { IconButton } from "@mui/material";
const DragAndDropZone = ({
  onDrop,
  open,
  getUploadParams,
  onChangeStatus,
  onSubmit,
  files,
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    // acceptedFiles,
    // fileRejections,
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
              Drag & drop some files here, or click to select files
            </Typography>
          )}

          <Box display="flex" alignItems="center" justifyContent="center">
            <Box width="60%">
              <ActionButton
                sx={{ textTransform: "none" }}
                variant={files && files.length ? "outlined" : "contained"}
                text={files && files.length ? "Add Files" : "Upload File(s)"}
                leftIcon="upload_file"
                // onClick={open}
                my={0}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default DragAndDropZone;
