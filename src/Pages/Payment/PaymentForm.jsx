import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../Provider/useAxiosSecure';
import { AuthContext } from '../../Provider/AuthProvider';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { parcelId } = useParams();
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [parcelInfo, setParcelInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchParcel = async () => {
            try {
                const res = await axiosSecure.get(`/parcels/${parcelId}`);
                setParcelInfo(res.data);
            } catch (err) {
                console.error("Error fetching parcel:", err);
                setError("Failed to load parcel info.");
            } finally {
                setLoading(false);
            }
        };
        fetchParcel();
    }, [parcelId, axiosSecure]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (cardError) {
            setError(cardError.message);
            return;
        }

        try {
            const amountInCents = Math.round(parcelInfo.cost * 100);
            const intentRes = await axiosSecure.post('/create-payment-intent', {
                amountInCents,
                parcelId
            });

            const clientSecret = intentRes.data?.clientSecret;
            if (!clientSecret) {
                setError("Payment intent creation failed.");
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card,
                    billing_details: {
                        name: user.displayName,
                        email: user.email
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else if (result.paymentIntent.status === 'succeeded') {
                const transactionId = result.paymentIntent.id;
                const paymentData = {
                    parcelId,
                    email: user.email,
                    amount: parcelInfo.cost,
                    transactionId,
                    paymentMethod: result.paymentIntent.payment_method_types,
                };

                const paymentRes = await axiosSecure.post('/payments', paymentData);
                if (paymentRes.data.insertedId) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Payment Successful!',
                        html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
                        confirmButtonText: 'Go to My Parcels',
                    });
                    navigate('/dashboard');
                }
            } else {
                setError("Payment could not be completed.");
            }
        } catch (err) {
            console.error("Payment error:", err);
            setError("An unexpected error occurred.");
        }
    };

    if (loading) return <p className="text-center text-gray-600 mt-10">Loading parcel info...</p>;

    return (
        <div className="py-36 flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-[#3b3b3b]">
                    Pay <span className="text-[#7aa300]">${parcelInfo.cost}</span>
                </h2>

                <CardElement className="p-3 border rounded-md bg-gray-50 shadow-inner" />

                <button
                    type="submit"
                    disabled={!stripe}
                    className="w-full py-2 rounded-md bg-[#c8ed63] text-gray-800 font-semibold hover:bg-[#b8dd50] transition-colors"
                >
                    Pay ${parcelInfo.cost}
                </button>

                {error && <p className="text-red-600 text-center text-sm">{error}</p>}
            </form>
        </div>
    );
};

export default PaymentForm;
