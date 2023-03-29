import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import {
  completeOrder,
  createPaymentIntent,
  updateOrder,
} from "../serverFunctions/order";
import ActionButton from "../components/Buttons/ActionButton";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";

const StripeCheckout = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    createPaymentIntent(props.order.id).then((res) => {
      console.log("create payment intent", res.data);
      setClientSecret(res.data.clientSecret);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    await updateOrder(props.order.id, props.orderInfo);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        },
      },
    });

    if (payload.error) {
      toast.error(payload.error.message);
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      const orderComplete = await completeOrder(props.order.id, payload);
      window.localStorage.removeItem("elbeeFiles");
      //get results after successful payment
      //create order and save in database
      //clear files in localstorage
      console.log(JSON.stringify(payload, null, 4));
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };
  const handleChange = async (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmooting: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },

      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <CardElement
          id="card-element"
          options={cardStyle}
          onChange={handleChange}
        />
        {/* <ActionButton
          text={
            <span id="button-text">
              {processing ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                "Pay"
              )}
            </span>
          }
          type="submit"
          disabled={processing || disabled || succeeded}
        /> */}
        {error ? (
          <Typography textAlign="center" color="error" variant="body2">
            {error}
          </Typography>
        ) : (
          ""
        )}
        <button
          className="stripe-button"
          disabled={processing || disabled || succeeded || error}
        >
          <span id="button-text">
            {processing ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              `Pay ($${props.order.total})`
            )}
          </span>
        </button>
      </form>
    </div>
  );
};

export default StripeCheckout;
