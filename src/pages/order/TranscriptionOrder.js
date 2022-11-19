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
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import AddLink from "../../components/PopUps/AddLink";

const TranscriptionOrder = () => {
  const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [openAddLink, setOpenAddLink] = useState(false);
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

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    console.log(acceptedFiles);
    console.log(rejectedFiles);
    acceptedFiles.map((file) => {
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
            amount: 50,
            src: e.target.result,
          },
        ]);
      };
      reader.readAsDataURL(file);

      return file;
    });
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
      if (files[i].type.includes("image")) {
        setRejectedFiles((prevState) => [
          ...prevState,
          { name: files[i].name, size: files[i].size },
        ]);
      } else {
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
              amount: 50,
              src: e.target.result,
            },
          ]);
        };
        reader.readAsDataURL(files[i]);
      }
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
        <Grid display={{ xs: "none", md: files.length && "block" }} item md={4}>
          <Card
            sx={{
              m: 1,
              // p: 1,
              display: "flex",
              flexDirection: "column",
              // borderRadius: "16px",
              background: " rgba(255, 255, 255, 0.7)",
              webkitBackdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.9)",
            }}
          >
            <Grid container justifyContent="center" my={3} spacing={2}>
              <Grid md={10}>
                <DragAndDropZone
                  onDrop={onDrop}
                  getUploadParams={getUploadParams}
                  onChangeStatus={handleChangeStatus}
                  onSubmit={handleSubmit}
                  files={files}
                />
              </Grid>

              <Grid item md={12}>
                <Typography sx={{ my: 1 }} variant="body2" align="center">
                  OR
                </Typography>
              </Grid>
              <Grid item md={6}>
                <Box>
                  <ActionButton
                    variant="outlined"
                    text={
                      <Typography>
                        <IconButton>
                          <Icon sx={{ color: "primary.main" }} fontSize="small">
                            add_link
                          </Icon>
                        </IconButton>
                        Add Link
                      </Typography>
                    }
                    my={0}
                    onClick={() => setOpenAddLink(true)}
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card
            sx={{
              m: 1,
              // p: 1,
              display: "flex",
              flexDirection: "column",
              // borderRadius: "16px",
              background: " rgba(255, 255, 255, 0.7)",
              webkitBackdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.9)",
            }}
          >
            {files.length ? (
              <List dense>
                {files.map((file, i) => (
                  <ListItem key={file.id}>
                    <Accordion sx={{ width: "100%" }}>
                      <AccordionSummary
                        expandIcon={<Icon>expand_more</Icon>}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={1.5}>
                            <Typography
                              variant="body2"
                              sx={{
                                flexShrink: 0,
                                color: "text.secondary",
                                mt: 0.5,
                              }}
                            >
                              <Icon
                                onClick={() => {
                                  let filteredFiles = files.filter(
                                    (f) => f.id !== file.id
                                  );
                                  setFiles(filteredFiles);
                                }}
                                fontSize="small"
                              >
                                delete
                              </Icon>
                            </Typography>
                          </Grid>
                          <Grid item xs={7.5}>
                            <Typography
                              // variant="body2"
                              sx={{
                                color: "text.secondary",
                                maxHeight: "30px",
                                overflow: "hidden",
                              }}
                            >
                              {file.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography
                              // variant="body2"
                              sx={{
                                color: "text.secondary",
                                maxHeight: "32px",
                                overflow: "hidden",
                              }}
                            >
                              ${file.amount}
                            </Typography>
                          </Grid>
                        </Grid>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2">
                          {file.name}
                          <br />
                          <br />
                          Here we'll display details of each file order...
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Subtitle title="Upload file or Link" align="center" />
            )}
            <Grid
              container
              justifyContent="center"
              my={1}
              spacing={2}
              display={{ md: files.length && "none" }}
              p={1}
            >
              <Grid item xs={files.length ? 6 : 12} md={files.length ? 6 : 9}>
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
                    // accept="audio/*,video/*"
                    style={{ display: "none" }}
                    onChange={handleMobileUpload}
                    multiple
                  />
                  <ActionButton
                    onClick={() =>
                      uploadInputRef.current && uploadInputRef.current.click()
                    }
                    variant={files.length ? "outlined" : "contained"}
                    text={
                      <Typography textTransform="none">
                        <IconButton>
                          <Icon
                            sx={{
                              color: files.length ? "primary.main" : "#fff",
                            }}
                            fontSize="small"
                          >
                            upload_file
                          </Icon>
                        </IconButton>
                        Upload
                      </Typography>
                    }
                    my={0}
                  />
                </Box>
              </Grid>
              {files.length ? (
                ""
              ) : (
                <Grid item sx={12} md={12}>
                  <Typography sx={{ my: 3 }} variant="body2" align="center">
                    OR
                  </Typography>
                </Grid>
              )}
              <Grid item xs={files.length ? 6 : 12} md={files.length ? 4 : 5}>
                <Box>
                  <ActionButton
                    variant={files.length ? "outlined" : "contained"}
                    text={
                      <Typography>
                        <IconButton>
                          <Icon
                            sx={{
                              color: files.length ? "primary.main" : "#fff",
                            }}
                            fontSize="small"
                          >
                            add_link
                          </Icon>
                        </IconButton>
                        Add Link
                      </Typography>
                    }
                    my={0}
                    onClick={() => setOpenAddLink(true)}
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
          <Grid p={1} container display={!files.length && "none"}>
            <Grid item xs={12}>
              <Grid container justifyContent="right">
                <Grid item xs={12} md={5}>
                  <ActionButton text="Checkout" rightIcon="arrow_forward" />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* /////////////////////////////////////////////////// */}
      </Grid>

      <AddLink open={openAddLink} close={() => setOpenAddLink(false)} />
    </Box>
  );
};

export default TranscriptionOrder;
