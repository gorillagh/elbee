import React from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { Box, Card, Grid, Icon, IconButton, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import ActionButton from "../Buttons/ActionButton";
import Subtitle from "../Typography/Subtitle";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  //   minWidth: 250,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "16px",
  p: 2,
};

const jobType = [
  {
    name: "Transcription",
    description: "Audio/Video to text",
    to: "/order/transcription",
  },
  {
    name: "Captioning",
    description: "Video Subtitling",
    to: "/order/captioning",
  },
  {
    name: "Translation",
    description: "Audio/Video Translation",
    to: "/order/translation",
  },
];

const ChooseOrderType = (props) => {
  const navigate = useNavigate();

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container justifyContent="right">
            <Grid item xs={1}>
              <IconButton onClick={props.closeModal}>
                <Icon fontSize="small">cancel</Icon>
              </IconButton>
            </Grid>
          </Grid>
          <Subtitle mt={0} title="Choose Order Type" textAlign="center" />

          <Grid container justifyContent="center" spacing={3}>
            {jobType.map((item, index) => (
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    width: "80%",
                    boxSizing: "boder-box",
                    border: "solid 1px",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
                    p: 3,
                    mx: "auto",
                    "&:hover": {
                      border: "solid 1px #e8a396",
                      boxShadow: "0 4px 30px rgba(18, 74, 84, 0.5)",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => navigate(item.to)}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {item.name}
                    </Typography>
                    <Typography variant="body1">{item.description}</Typography>
                    <Typography color="info.dark">
                      Let's Go{" "}
                      <Typography color="info.dark" component="a">
                        <ArrowForwardIcon sx={{ fontSize: "0.8rem" }} />{" "}
                      </Typography>
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default ChooseOrderType;
