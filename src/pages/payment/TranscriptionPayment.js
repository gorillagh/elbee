import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import ProgressStepper from "../../components/Navbars/ProgressStepper";
import PageTitle from "../../components/Typography/PageTitle";
import Subtitle from "../../components/Typography/Subtitle";
import { toast } from "react-toastify";
import LoadingBackdrop from "../../components/Feedbacks/LoadingBackdrop";
import { getOrder } from "../../serverFunctions/order";

const TranscriptionPayment = () => {
  const [order, setOrder] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { orderId } = useParams();

  const dispatch = useDispatch();
  const { stepper, user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    setLoading(true);
    dispatch({
      type: "STEPPER",
      payload: 1,
    });
    async function fetchOrder() {
      const { data } = await getOrder(orderId);
      console.log(data);
      setOrder(data);
      setLoading(false);
    }
    fetchOrder();
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
      <Grid justifyContent="center" container my={3}>
        <Grid item xs={6} md={9}>
          <PageTitle mt={0} mb={0} title="Transcription" />
          <Subtitle mt={0} mb={0} title="(Payment)" />
        </Grid>
        <Grid item xs={6} md={3}>
          <ProgressStepper stepper={stepper} />
        </Grid>
      </Grid>
      <Box>
        {" "}
        {order ? (
          <PageTitle title={`Your are going to pay ${order.total}`} />
        ) : (
          ""
        )}{" "}
      </Box>
      <LoadingBackdrop open={loading} />
    </Box>
  );
};

export default TranscriptionPayment;
