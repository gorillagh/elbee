import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js/pure";
import { Elements } from "@stripe/react-stripe-js";
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
import "../../stripe.css";
import StripeCheckout from "../../components/StripeCheckout";
import {
  Card,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const TranscriptionPayment = () => {
  const [order, setOrder] = useState();
  const [loading, setLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState({});
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
      data.userId &&
        setOrderInfo((prevState) => ({
          ...prevState,
          receiverEmail: data.userId.email,
        }));
      setLoading(false);
    }
    fetchOrder();
  }, []);

  const handlePaymentMethod = async (e) => {
    setOrderInfo((prevState) => ({
      ...prevState,
      paymentMethod: e.target.value,
    }));
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
          <div>
            <Grid container>
              <Grid display={{ xs: "none", md: "block" }} item md={5}>
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
                ></Card>
              </Grid>
              <Grid item md={7} xs={12}>
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
                  <TextField
                    sx={{ my: 1 }}
                    disabled={
                      order &&
                      order.userId &&
                      user &&
                      order.userId._id !== user._id
                      // : !user && order.userId
                      // ? true
                      // : false
                    }
                    required
                    fullWidth
                    id="email"
                    label="Send transcript to"
                    placeholder="Email"
                    name="email"
                    autoComplete="email"
                    value={orderInfo.receiverEmail}
                    onChange={(e) =>
                      setOrderInfo((prevState) => ({
                        ...prevState,
                        receiverEmail: e.target.value,
                      }))
                    }
                  />
                  <TextField
                    sx={{ my: 1 }}
                    id="Notes"
                    label="Notes"
                    multiline
                    rows={3}
                    value={orderInfo.notes}
                    onChange={(e) =>
                      setOrderInfo((prevState) => ({
                        ...prevState,
                        notes: e.target.value,
                      }))
                    }
                  />
                  <FormControl>
                    <Typography mt={3} mb={1} fontWeight="bold">
                      Select payment method
                    </Typography>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      onChange={handlePaymentMethod}
                    >
                      <Grid container justifyContent="center">
                        <Grid item xs={6}>
                          <FormControlLabel
                            value="card"
                            control={<Radio />}
                            label="Card"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControlLabel
                            value="paypal"
                            control={<Radio />}
                            label="PayPal"
                          />
                        </Grid>
                      </Grid>
                    </RadioGroup>
                  </FormControl>
                  <br />
                  <Box display={orderInfo.paymentMethod !== "card" && "none"}>
                    {promise && (
                      <Elements stripe={promise}>
                        <StripeCheckout order={order} orderInfo={orderInfo} />
                      </Elements>
                    )}
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </div>
        ) : (
          ""
        )}{" "}
      </Box>
      <LoadingBackdrop open={loading} />
    </Box>
  );
};

export default TranscriptionPayment;
