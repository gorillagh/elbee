import React, { useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import ActionButton from "../../components/Buttons/ActionButton";
import ProgressStepper from "../../components/Navbars/ProgressStepper";
import PageTitle from "../../components/Typography/PageTitle";
import Subtitle from "../../components/Typography/Subtitle";
import DragAndDropZone from "../../components/Inputs/DragAndDropZone";
import cuid from "cuid";

const TranscriptionOrder = () => {
  const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const uploadInputRef = useRef(null);

  const Input = styled("input")({
    display: "none",
  });

  const dispatch = useDispatch();
  const { stepper } = useSelector((state) => ({ ...state }));

  const getUploadParams = ({ meta }) => {
    const url = "https://httpbin.org/post";
    return {
      url,
      meta: { fileUrl: `${url}/${encodeURIComponent(meta.name)}` },
    };
  };

  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta);
  };

  const handleSubmit = (files, allFiles) => {
    console.log(files.map((f) => f.meta));
    allFiles.forEach((f) => f.remove());
  };

  const loadFiles = (files) =>
    files.map((file) => {
      console.log(file);
      const reader = new FileReader();
      reader.onload = function (e) {
        console.log("Event---->", e.target);
        setFiles((prevState) => [
          ...prevState,
          {
            id: cuid(),
            name: file.name,
            type: file.type,
            size: file.size,
            src: e.target.result,
          },
        ]);
      };
      reader.readAsDataURL(file);

      return file;
    });

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    console.log(acceptedFiles);
    console.log(rejectedFiles);
    loadFiles(acceptedFiles);
    rejectedFiles.map((file) =>
      setRejectedFiles((prev) => [
        ...prev,
        { name: file.path, size: file.size },
      ])
    );
  }, []);

  const handleMobileUpload = (e) => {
    let files = e.target.files;
    console.log("Files--->", files);
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = function (e) {
        console.log("Event---->", e.target);
        setFiles((prevState) => [
          ...prevState,
          {
            id: cuid(),
            name: files[i].name,
            type: files[i].type,
            size: files[i].size,
            src: e.target.result,
          },
        ]);
      };
      reader.readAsDataURL(files[i]);

      // return files[i];
    }
  };

  const handleBack = () => {
    dispatch({
      type: "STEPPER",
      payload: stepper - 1,
    });
  };

  const handleNext = () => {
    dispatch({
      type: "STEPPER",
      payload: stepper + 1,
    });
  };

  return (
    <Box>
      <Grid justifyContent="center" container my={3}>
        <Grid item xs={6} md={9}>
          <PageTitle mt={0} title="Transcription" />
        </Grid>
        <Grid item xs={6} md={3}>
          <ProgressStepper stepper={stepper} />
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              m: 1,
              p: 2,
              display: "flex",
              flexDirection: "column",
              // borderRadius: "16px",
              background: " rgba(255, 255, 255, 0.7)",
              webkitBackdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.9)",
            }}
          >
            <Subtitle title="Upload file or Link" align="center" />
            <Grid container justifyContent="center" my={3}>
              <Grid item xs={12} md={9}>
                <DragAndDropZone
                  onDrop={onDrop}
                  getUploadParams={getUploadParams}
                  onChangeStatus={handleChangeStatus}
                  onSubmit={handleSubmit}
                />
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                  <input
                    ref={uploadInputRef}
                    type="file"
                    accept="audio/*,video/*, .mp3"
                    style={{ display: "none" }}
                    onChange={handleMobileUpload}
                    multiple
                  />
                  <ActionButton
                    onClick={() =>
                      uploadInputRef.current && uploadInputRef.current.click()
                    }
                    variant="contained"
                    text={
                      <Typography textTransform="none">
                        <IconButton>
                          <Icon sx={{ color: "#fff" }} fontSize="small">
                            upload_file
                          </Icon>
                        </IconButton>
                        Upload File(s)
                      </Typography>
                    }
                    my={0}
                  />
                </Box>

                {/* /////////////Control tesy//////////////////// */}
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                  <input
                    ref={uploadInputRef}
                    type="file"
                    // accept="audio/*,video/*, .mp3"
                    style={{ display: "none" }}
                    onChange={handleMobileUpload}
                    multiple
                  />
                  <ActionButton
                    onClick={() =>
                      uploadInputRef.current && uploadInputRef.current.click()
                    }
                    variant="contained"
                    text={
                      <Typography textTransform="none">
                        <IconButton>
                          <Icon sx={{ color: "#fff" }} fontSize="small">
                            upload_file
                          </Icon>
                        </IconButton>
                        Upload File(s) -2
                      </Typography>
                    }
                    my={0}
                  />
                </Box>
                {/* //////////////////////////////////////////////// */}
              </Grid>
              <Grid item sx={12} md={12}>
                <Typography sx={{ my: 3 }} variant="body2" align="center">
                  OR
                </Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box>
                  <ActionButton
                    variant="contained"
                    text={
                      <Typography>
                        <IconButton>
                          <Icon sx={{ color: "#fff" }} fontSize="small">
                            add_link
                          </Icon>
                        </IconButton>
                        Add Link
                      </Typography>
                    }
                    my={0}
                    onClick={() => console.log("files--->", files)}
                  />
                </Box>
              </Grid>
            </Grid>
            {/* <Grid container>
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <ActionButton
                  text="Back"
                  variant="outlined"
                  fullWidth={false}
                  onClick={handleBack}
                />
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "center" }}>
                <ActionButton
                  text={stepper <= 1 ? "Next" : "pay"}
                  fullWidth={false}
                  onClick={handleNext}
                />
              </Grid>
            </Grid> */}
          </Card>
        </Grid>
      </Grid>
      <aside>
        <h4>Accepted files</h4>
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              {file.name} - {file.type} - {file.size}
            </li>
          ))}
        </ul>
        <h4>Rejected files</h4>
        <ul>
          {rejectedFiles.map((file, i) => (
            <li key={file.name}>
              {file.name} - {file.size} bytes
            </li>
          ))}
        </ul>
      </aside>
    </Box>
  );
};

export default TranscriptionOrder;
