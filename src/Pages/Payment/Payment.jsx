import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe('pk_test_51RebBIHIFQWVfMjzDVfpZ4Jso6j7en5Zc4Ey4YHSViUAjDsCvk9UiGpjrFXR7pLDTsqag02lPOon6f28S9keEe9b0007kt9QCS');

const Payment = () => {
    return (
        <div>
            <Elements stripe={stripePromise}>
                <PaymentForm></PaymentForm>
            </Elements>
        </div>
    );
};

export default Payment;