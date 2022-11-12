import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, Grid, Typography } from "@mui/material";
import ActionButton from "../../components/Buttons/ActionButton";
import ProgressStepper from "../../components/Navbars/ProgressStepper";
import PageTitle from "../../components/Typography/PageTitle";
import Subtitle from "../../components/Typography/Subtitle";
import DragAndDropZone from "../../components/Inputs/DragAndDropZone";
import cuid from "cuid";
import MediaPlayer from "../../components/Inputs/MediaPlayer";
import ffprobe from "ffprobe";
import ffprobeStatic from "ffprobe-static";

const TranscriptionOrder = () => {
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

  const [images, setImages] = useState([]);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        console.log("Event---->", e);
        ffprobe(file, { path: ffprobeStatic.path }, function (err, info) {
          if (err) return err;
          console.log(info);
        });

        setImages((prevState) => [
          ...prevState,
          { id: cuid(), src: e.target.result },
        ]);
      };
      reader.readAsDataURL(file);
      console.log("file---->>", file);
      return file;
    });
  }, []);

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
      {/* <MediaPlayer url={images[0].src} /> */}
      <Grid justifyContent="center" container my={3}>
        <Grid item xs={12} md={9}>
          <PageTitle mt={0} title="Transcription" />
        </Grid>
        <Grid item xs={9} md={3}>
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
              <Grid item xs={12} md={8}>
                <DragAndDropZone
                  onDrop={onDrop}
                  getUploadParams={getUploadParams}
                  onChangeStatus={handleChangeStatus}
                  onSubmit={handleSubmit}
                />
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                  <ActionButton variant="outlined" text="Upload files" my={0} />
                </Box>
              </Grid>
              <Grid item sx={12} md={12}>
                <Typography
                  sx={{ my: 3 }}
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  OR
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <ActionButton
                    variant="contained"
                    text="Add link"
                    my={0}
                    onClick={() => console.log("images--->", images)}
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
    </Box>
  );
};

export default TranscriptionOrder;
