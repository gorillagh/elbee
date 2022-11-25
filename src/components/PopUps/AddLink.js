import React from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Box, Grid, Icon, IconButton, TextField } from "@mui/material";
import ActionButton from "../Buttons/ActionButton";
import Subtitle from "../Typography/Subtitle";
import ReactPlayer from "react-player";
import cuid from "cuid";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 400,
  minWidth: 250,
  bgcolor: "background.paper",
  //   border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "12px",
  p: 2,
};

const AddLink = (props) => {
  const [url, setUrl] = React.useState();
  const [fileDuration, setFileDuration] = React.useState();
  const [linkFile, setLinkFile] = React.useState({});

  const handleDuration = async (e, type, size) => {
    let duration = Number(e) / 60;

    duration =
      duration % 1 > 0
        ? (duration > 0 ? Math.floor(duration) : Math.ceil(duration)) + 1
        : duration > 0
        ? Math.floor(duration)
        : Math.ceil(duration);

    if (duration > 0)
      setLinkFile({
        id: cuid(),
        name: url,
        type: type || "video",
        size: size || "",
        amount: duration * 1.0,
        duration,
        src: url,
        express: false,
        verbatim: false,
        timeStamp: false,
        total: duration * 1.0,
      });
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();

    await props.setFiles((prevState) => [...prevState, linkFile]);
    setUrl("");
    setLinkFile({});
    props.close();
  };
  return (
    <div>
      <Modal
        open={props.open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box display="none">
            <ReactPlayer url={url} onDuration={handleDuration} />
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container justifyContent="right">
              <Grid mb={2} item xs={1}>
                <Icon
                  color="error"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setUrl("");
                    setLinkFile({});
                    props.close();
                  }}
                >
                  cancel
                </Icon>
              </Grid>
            </Grid>
            {/* <Subtitle title="Add Link" /> */}
            <TextField
              id="outlined-multiline-flexible"
              placeholder="Paste link here..."
              fullWidth
              multiline
              rows={4}
              onChange={(e) => setUrl(e.target.value)}
            />
            <ActionButton
              type="submit"
              text="Submit"
              disabled={!linkFile.duration}
            />
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AddLink;
