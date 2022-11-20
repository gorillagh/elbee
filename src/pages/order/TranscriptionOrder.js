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
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddLink from "../../components/PopUps/AddLink";

const additionalPackages = [
  { name: "Express Order", details: "$0.3/min", cost: "$10" },
  { name: "Timestamp", details: "$0.5/min", cost: "$15" },
  { name: "Verbatim", details: "$0.5/min", cost: "$15" },
];

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
                <Typography sx={{ my: 1 }} align="center">
                  OR
                </Typography>
              </Grid>
              <Grid item md={6}>
                <Box>
                  <ActionButton
                    variant="outlined"
                    text="Add Links"
                    leftIcon="add_link"
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
              <>
                <Grid
                  container
                  justifyContent="center"
                  // my={1}
                  spacing={2}
                  display={{ md: "none" }}
                  p={1}
                >
                  <Grid item xs={6}>
                    <Box>
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
                          uploadInputRef.current &&
                          uploadInputRef.current.click()
                        }
                        variant="outlined"
                        text="Add Files"
                        // leftIcon="upload_file"
                        my={0}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <ActionButton
                        variant="outlined"
                        text="Add Links"
                        // leftIcon="add_link"
                        my={0}
                        onClick={() => setOpenAddLink(true)}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <List dense>
                  {files.map((file, i) => (
                    <ListItem key={file.id}>
                      <Accordion
                        sx={{ width: "100%" }}
                        defaultExpanded={i + 1 === files.length}
                      >
                        <AccordionSummary
                          expandIcon={
                            <Icon sx={{ color: "info.dark" }}>expand_more</Icon>
                          }
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
                                  sx={{ color: "error.light" }}
                                >
                                  delete_outlined
                                </Icon>
                              </Typography>
                            </Grid>
                            <Grid item xs={7.5}>
                              <Typography
                                fontWeight={500}
                                // variant="body2"
                                sx={{
                                  // color: "text.secondary",
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
                                fontWeight={500}
                                sx={{
                                  // color: "text.secondary",
                                  maxHeight: "32px",
                                  overflow: "hidden",
                                }}
                              >
                                ${file.amount}
                              </Typography>
                            </Grid>
                          </Grid>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 3 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {file.name}
                          </Typography>
                          {additionalPackages.map((p, i) => (
                            <Grid container spacing={1} my={0.1}>
                              <Grid item xs={1.5}>
                                <Checkbox
                                  size="small"
                                  sx={{ color: "info.dark" }}
                                />
                              </Grid>
                              <Grid item xs={7.5}>
                                <Typography variant="body2" fontWeight={400}>
                                  {p.name}
                                </Typography>
                                <Typography variant="body2">
                                  {p.details}
                                </Typography>
                              </Grid>
                              <Grid item xs={3}>
                                <Typography variant="body2" fontWeight={400}>
                                  {p.cost}
                                </Typography>
                              </Grid>
                            </Grid>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <Subtitle title="Upload file or Link" align="center" />
            )}
            <Grid
              container
              justifyContent="center"
              my={1}
              spacing={2}
              display={{
                xs: files.length && "none",
                md: files.length && "none",
              }}
              p={1}
            >
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
                    // accept="audio/*,video/*"
                    style={{ display: "none" }}
                    onChange={handleMobileUpload}
                    multiple
                  />
                  <ActionButton
                    onClick={() =>
                      uploadInputRef.current && uploadInputRef.current.click()
                    }
                    text="Upload"
                    leftIcon="upload_file"
                    my={0}
                  />
                </Box>
              </Grid>

              <Grid item sx={12} md={12}>
                <Typography sx={{ my: 3 }} align="center">
                  OR
                </Typography>
              </Grid>

              <Grid item xs={12} md={5}>
                <Box>
                  <ActionButton
                    text="Add Link"
                    leftIcon="add_link"
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
          <Grid container display={!files.length && "none"}>
            <Grid item xs={12}>
              <Grid container justifyContent="right">
                <Grid item xs={12} md={5}>
                  <Card
                    sx={{
                      m: 1,
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                      // borderRadius: "16px",
                      background: " rgba(255, 255, 255, 0.7)",
                      webkitBackdropFilter: "blur(5px)",
                      border: "1px solid rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    <Grid container justifyContent="space-between" px={2}>
                      <Grid item>
                        <Typography textAlign="center" variant="h5">
                          Total
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          component="span"
                          variant="h5"
                          fontWeight={700}
                        >
                          $200
                        </Typography>
                      </Grid>
                    </Grid>

                    <ActionButton
                      my={0}
                      text="Checkout"
                      rightIcon="arrow_forward"
                    />
                  </Card>
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
