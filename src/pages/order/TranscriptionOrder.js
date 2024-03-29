import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
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
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import AddLink from "../../components/PopUps/AddLink";
import { saveOrderToDb, uploadFile } from "../../serverFunctions/order";
import { CircularProgress, LinearProgress } from "@mui/material";
import LinearProgressWithPercentage from "../../components/Feedbacks/LinearProgressWithPercentage";
import SignIn from "../../components/PopUps/SignIn";

const TranscriptionOrder = () => {
  const [files, setFiles] = useState([]);
  const [totalCost, setTotalCost] = useState();
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [openAddLink, setOpenAddLink] = useState(false);
  const uploadInputRef = useRef(null);
  const [accordionExpanded, setAccordionExpanded] = useState([]);
  const [progress, setProgress] = useState();
  const [filesInQueue, setFilesInQueue] = useState(0);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stepper, user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    async function fetchFiles() {
      if (window.localStorage.getItem("elbeeFiles")) {
        const storedFiles = await JSON.parse(
          window.localStorage.getItem("elbeeFiles")
        );
        await storedFiles.map(
          (file, i) =>
            (file.total =
              Number(file.cost) +
              (file.express ? Number(file.duration) * 0.3 : 0) +
              (file.verbatim ? Number(file.duration) * 0.5 : 0) +
              (file.timeStamp ? Number(file.duration) * 0.4 : 0))
        );
        setFiles(storedFiles);
      }
    }
    fetchFiles();
  }, []);

  useEffect(() => {
    files && files.length && calculateTotalCost(files);
  }, [files]);
  useEffect(() => {
    dispatch({
      type: "STEPPER",
      payload: 0,
    });
  }, []);

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

  const calculateFileCost = (file) => {
    file.total =
      Number(file.cost) +
      (file.express ? Number(file.duration) * 0.3 : 0) +
      (file.verbatim ? Number(file.duration) * 0.5 : 0) +
      (file.timeStamp ? Number(file.duration) * 0.4 : 0);

    setFiles((prevState) => {
      let foundIndex = prevState.findIndex((f) => f.id === file.id);
      prevState[foundIndex].total = (
        Math.round(file.total * 100) / 100
      ).toFixed(2);

      return [...prevState];
    });
  };
  const calculateTotalCost = (files) => {
    var total = 0;
    if (files && files.length) {
      for (var i in files) {
        total += Number(files[i].total);
      }
      setTotalCost((Math.round(total * 100) / 100).toFixed(2));
    }
  };

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    try {
      console.log(acceptedFiles);
      console.log(rejectedFiles);
      rejectedFiles.map((file) =>
        setRejectedFiles((prev) => [
          ...prev,
          { name: file.path, size: file.size },
        ])
      );
      setFilesInQueue(acceptedFiles.length - 1);
      acceptedFiles.map(async (file) => {
        let fileId = uuid();
        setFiles((prevState) => [
          ...prevState,
          {
            id: fileId,
            name: file.name,
          },
        ]);
        const fileData = new FormData();
        fileData.append("file", file, `${fileId}/${file.name}`);
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/uploadfile/transcription`,
          fileData
          // {
          //   onUploadProgress: (e) => {
          //     setProgress(Math.round((100 * e.loaded) / e.total));
          //   },
          // }
        );
        console.log(data);
        setFiles((prevState) => {
          let foundIndex = prevState.findIndex((f) => f.id === data.id);
          prevState[foundIndex] = data;
          window.localStorage.setItem("elbeeFiles", JSON.stringify(prevState));
          return [...prevState];
        });

        setFilesInQueue((prevState) => prevState - 1);
      });
    } catch (error) {
      console.log(error);
      toast.error("File upload failed");
    }
  }, []);

  const handleMobileUpload = async (e) => {
    try {
      let acceptedFiles = [];
      let files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.includes("image")) {
          setRejectedFiles((prevState) => [
            ...prevState,
            { name: files[i].name, size: files[i].size },
          ]);
        } else {
          acceptedFiles.push(files[i]);
        }
      }
      setFilesInQueue((prevState) => Number(prevState) + files.length);
      console.log("Files--->", files);
      acceptedFiles.map(async (file, i) => {
        let fileId = uuid();
        setFiles((prevState) => [
          ...prevState,
          {
            id: fileId,
            name: file.name,
          },
        ]);
        const fileData = new FormData();
        fileData.append("file", file, `${fileId}/${file.name}`);
        // const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}`);

        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/uploadfile/transcription`,
          fileData
          // {
          //   onUploadProgress: (e) => {
          //     let foundIndex = acceptedFiles.findIndex((f) => f.id === file.id);
          //     acceptedFiles[foundIndex].uploadProgress = Math.round(
          //       (e.loaded / e.total) * 100
          //     );
          //     console.log(acceptedFiles);
          // setProgress(Math.round((e.loaded / e.total) * 100));
          // console.log(Math.round((e.loaded / e.total) * 100));
          //   },
          // }
        );
        // eventSource.onmessage = (e) => {
        //   console.log(e.data);
        // };
        setProgress(data.progress);
        // const data = await fetch(
        //   `${process.env.REACT_APP_API_URL}/uploadfile/transcription`,
        //   { method: "POST", body: fileData, mode: "no-cors" }
        // ).then((res) => res.json());

        setFiles((prevState) => {
          let foundIndex = prevState.findIndex((f) => f.id === data.id);
          prevState[foundIndex] = data;
          window.localStorage.setItem("elbeeFiles", JSON.stringify(prevState));

          return [...prevState];
        });
        setFilesInQueue((prevState) => prevState - 1);
      });
    } catch (error) {
      console.log(error);
      toast.error("File upload failed");
    }
  };

  const handleBack = () => {
    dispatch({
      type: "STEPPER",
      payload: stepper - 1,
    });
  };

  const handleNext = async () => {
    setLoading(true);
    let userOrder = {
      id: uuid(),
      files,
      type: "transcription",
    };
    setOrder(userOrder);
    if (!user) {
      setOpenSignIn(true);
    }
    if (user) {
      userOrder.userId = await user._id;
      setOrder(userOrder);
      await saveOrderToDb(userOrder);
      navigate(`/payment/transcription/${userOrder.id}`);
    }

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
                        disabled={file.total ? false : true}
                        // disabled
                        sx={{ width: "100%" }}
                        onChange={(event, isExpanded) => {
                          if (isExpanded) {
                            setAccordionExpanded((prevState) => [
                              ...prevState,
                              file.id,
                            ]);
                          } else {
                            setAccordionExpanded((prevState) => {
                              prevState = prevState.filter(
                                (item) => item !== file.id
                              );
                              return [...prevState];
                            });
                          }
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            file.total ? (
                              <Icon sx={{ color: "info.dark" }}>
                                expand_more
                              </Icon>
                            ) : (
                              ""
                              // <CircularProgress size={20} thickness={4} />
                            )
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
                                    window.localStorage.setItem(
                                      "elbeeFiles",
                                      JSON.stringify(filteredFiles)
                                    );
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
                                display={
                                  accordionExpanded.includes(file.id) && "none"
                                }
                                fontWeight={500}
                                variant="body2"
                                sx={{
                                  // color: "text.secondary",
                                  maxHeight: "30px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  inlineSize: { xs: "150px", md: "100%" },
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {file.name}
                              </Typography>
                              {file.total ? (
                                ""
                              ) : (
                                <LinearProgress />
                                // <LinearProgressWithPercentage
                                //   value={file.uploadProgress}
                                // />
                              )}
                            </Grid>
                            <Grid item xs={3}>
                              <Typography
                                display={
                                  accordionExpanded.includes(file.id) && "none"
                                }
                                variant="body2"
                                fontWeight={500}
                                sx={{
                                  // color: "text.secondary",
                                  maxHeight: "32px",
                                  overflow: "hidden",
                                }}
                              >
                                {file.total
                                  ? "$" +
                                    (
                                      Math.round(file.total * 100) / 100
                                    ).toFixed(2)
                                  : ""}
                              </Typography>
                            </Grid>
                          </Grid>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 3 }}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            {file.name}
                          </Typography>
                          <br />
                          <Grid container spacing={1}>
                            <Grid item xs={9}>
                              <Typography variant="body2" fontWeight={600}>
                                Duration: {file.duration}{" "}
                                {file.duration > 1 ? "mins" : "min"}
                              </Typography>

                              <Typography variant="body2" fontWeight={600}>
                                Turnaround: 2hrs
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography
                                variant="body2"
                                fontWeight={400}
                                textAlign={{ xs: "right", md: "left" }}
                              >
                                $
                                {(Math.round(file.cost * 100) / 100).toFixed(2)}
                              </Typography>
                            </Grid>
                          </Grid>

                          {/* //////////////////Additional Packages////////////////////////// */}
                          <Grid container spacing={1} my={0.1}>
                            <Grid item xs={1.5}>
                              <Checkbox
                                checked={file.express}
                                size="small"
                                sx={{
                                  color: "info.light",
                                  "&.Mui-checked": {
                                    color: "info.dark",
                                  },
                                }}
                                onChange={(e, isChecked) => {
                                  setFiles((prevState) => {
                                    let foundIndex = prevState.findIndex(
                                      (f) => f.id === file.id
                                    );
                                    prevState[foundIndex].express = isChecked;
                                    window.localStorage.setItem(
                                      "elbeeFiles",
                                      JSON.stringify(prevState)
                                    );
                                    return [...prevState];
                                  });
                                  calculateFileCost(file);
                                  calculateTotalCost(files);
                                }}
                              />
                            </Grid>
                            <Grid item xs={7.5}>
                              <Typography variant="body2" fontWeight={400}>
                                Express Order
                              </Typography>
                              <Typography variant="body2">
                                (+$0.3/min)
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography
                                variant="body2"
                                fontWeight={400}
                                textAlign={{ xs: "right", md: "left" }}
                                display={!file.express && "none"}
                              >
                                $
                                {(
                                  Math.round(file.duration * 0.3 * 100) / 100
                                ).toFixed(2)}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container spacing={1} my={0.1}>
                            <Grid item xs={1.5}>
                              <Checkbox
                                checked={file.timeStamp}
                                size="small"
                                sx={{
                                  color: "info.light",
                                  "&.Mui-checked": {
                                    color: "info.dark",
                                  },
                                }}
                                onChange={(e, isChecked) => {
                                  setFiles((prevState) => {
                                    let foundIndex = prevState.findIndex(
                                      (f) => f.id === file.id
                                    );
                                    prevState[foundIndex].timeStamp = isChecked;
                                    window.localStorage.setItem(
                                      "elbeeFiles",
                                      JSON.stringify(prevState)
                                    );
                                    return [...prevState];
                                  });
                                  calculateFileCost(file);
                                  calculateTotalCost(files);
                                }}
                              />
                            </Grid>
                            <Grid item xs={7.5}>
                              <Typography variant="body2" fontWeight={400}>
                                Timestamp
                              </Typography>
                              <Typography variant="body2">
                                (+$0.4/min)
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography
                                variant="body2"
                                fontWeight={400}
                                textAlign={{ xs: "right", md: "left" }}
                                display={!file.timeStamp && "none"}
                              >
                                $
                                {(
                                  Math.round(file.duration * 0.4 * 100) / 100
                                ).toFixed(2)}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container spacing={1} my={0.1}>
                            <Grid item xs={1.5}>
                              <Checkbox
                                size="small"
                                sx={{
                                  color: "info.light",
                                  "&.Mui-checked": {
                                    color: "info.dark",
                                  },
                                }}
                                checked={file.verbatim}
                                onChange={(e, isChecked) => {
                                  setFiles((prevState) => {
                                    let foundIndex = prevState.findIndex(
                                      (f) => f.id === file.id
                                    );
                                    prevState[foundIndex].verbatim = isChecked;
                                    window.localStorage.setItem(
                                      "elbeeFiles",
                                      JSON.stringify(prevState)
                                    );
                                    return [...prevState];
                                  });
                                  calculateFileCost(file);
                                  calculateTotalCost(files);
                                }}
                              />
                            </Grid>
                            <Grid item xs={7.5}>
                              <Typography variant="body2" fontWeight={400}>
                                Verbatim
                              </Typography>
                              <Typography variant="body2">
                                (+$0.5/min)
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography
                                variant="body2"
                                fontWeight={400}
                                textAlign={{ xs: "right", md: "left" }}
                                display={!file.verbatim && "none"}
                              >
                                $
                                {(
                                  Math.round(file.duration * 0.5 * 100) / 100
                                ).toFixed(2)}
                              </Typography>
                            </Grid>
                          </Grid>

                          {/* //////////////////Additional Packages////////////////////////// */}

                          <Grid
                            container
                            spacing={1}
                            my={0.1}
                            justifyContent="right"
                          >
                            <Grid item xs={3}>
                              <Typography variant="body2" fontWeight={500}>
                                Total
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography
                                variant="body2"
                                fontWeight={500}
                                textAlign={{ xs: "right", md: "left" }}
                              >
                                $
                                {(Math.round(file.total * 100) / 100).toFixed(
                                  2
                                )}
                              </Typography>
                            </Grid>
                          </Grid>
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
            {filesInQueue > 0 ? (
              <Typography
                variant="body2"
                color="info.dark"
                textAlign="center"
                fontWeight={500}
              >
                upolading {filesInQueue} {filesInQueue > 1 ? "files" : "file"}
                ...
              </Typography>
            ) : (
              ""
            )}
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
                          {filesInQueue > 0 || !totalCost ? (
                            <CircularProgress size={20} thickness={4} />
                          ) : (
                            `$${totalCost}`
                            // "$" + totalCost
                          )}
                        </Typography>
                      </Grid>
                    </Grid>

                    <ActionButton
                      disabled={filesInQueue > 0}
                      my={0}
                      text="Checkout"
                      rightIcon="arrow_forward"
                      onClick={handleNext}
                    />
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* /////////////////////////////////////////////////// */}
      </Grid>

      <AddLink
        open={openAddLink}
        close={() => setOpenAddLink(false)}
        files={files}
        setFiles={setFiles}
      />
      <SignIn
        open={openSignIn}
        close={() => setOpenSignIn(false)}
        order={order}
        setOrder={setOrder}
      />
    </Box>
  );
};

export default TranscriptionOrder;
