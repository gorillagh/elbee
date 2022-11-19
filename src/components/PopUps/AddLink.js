import React from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Box, Grid, Icon, IconButton, TextField } from "@mui/material";
import ActionButton from "../Buttons/ActionButton";
import Subtitle from "../Typography/Subtitle";

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
  const handleSubmit = (e) => {
    e.preventDefault();
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
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container justifyContent="right">
              <Grid mb={2} item xs={1}>
                <Icon color="error" onClick={props.close}>
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
            />
            <ActionButton type="submit" text="Submit" />
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AddLink;
