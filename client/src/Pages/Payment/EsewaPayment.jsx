import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import { BsFillBagCheckFill } from "react-icons/bs";
import { MdPayment } from "react-icons/md";
import { initiateEsewaPayment } from '../../utils/api';
import toast from 'react-hot-toast';

const EsewaPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState({
        orderId: null,
        orderNumber: '',
        amount: 0,
    });
    const [paymentResponse, setPaymentResponse] = useState(null);

    useEffect(() => {
        // Get payment data from location state
        if (location.state) {
            console.log('Location state:', location.state);
            setPaymentData({
                orderId: location.state.orderId,
                orderNumber: location.state.orderNumber || 'N/A',
                amount: location.state.amount || 0,
            });
        } else {
            // If no state in location, redirect back
            toast.error('No order data found');
            navigate('/checkout');
        }
    }, [location.state, navigate]);

    // Auto-initiate payment when component loads
    useEffect(() => {
        if (paymentData.orderId && !paymentResponse) {
            handleRealEsewaPayment();
        }
    }, [paymentData.orderId]);

    const handleRealEsewaPayment = async () => {
        if (!paymentData.orderId) {
            toast.error('Order ID is missing');
            return;
        }

        console.log('Starting eSewa payment for order:', paymentData.orderId);
        setLoading(true);
        
        try {
            // Initiate REAL eSewa payment
            const response = await initiateEsewaPayment(paymentData.orderId);
            
            console.log('Backend response:', response);
            
            if (response.success && response.data) {
                setPaymentResponse(response.data);
                
                console.log('Payment URL:', response.data.paymentUrl);
                console.log('Payment data keys:', Object.keys(response.data.paymentData));
                
                // AUTO-SUBMIT FORM after a short delay
                setTimeout(() => {
                    submitToEsewa(response.data);
                }, 500);
                
            } else {
                console.error('Payment initiation failed:', response);
                toast.error(response.message || 'Failed to initiate payment');
                setLoading(false);
            }
        } catch (error) {
            console.error('Payment initiation error:', error);
            toast.error('Error initiating payment');
            setLoading(false);
        }
    };

    const submitToEsewa = (paymentData) => {
        console.log('Submitting to eSewa...');
        
        // Create a form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentData.paymentUrl;
        form.style.display = 'none';
        
        // Add all payment data as hidden inputs
        Object.entries(paymentData.paymentData).forEach(([key, value]) => {
            console.log(`Adding field: ${key} = ${value}`);
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
        });
        
        // Add form to body and submit
        document.body.appendChild(form);
        console.log('Form created, submitting now...');
        form.submit();
    };

    const manualSubmit = () => {
        if (paymentResponse) {
            submitToEsewa(paymentResponse);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Preparing Payment</h1>
                    <p className="text-gray-600 mb-6">
                        Please wait while we redirect you to eSewa...
                    </p>
                    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
                        <div className="mb-4">
                            <p className="text-sm text-gray-500">Order: {paymentData.orderNumber}</p>
                            <p className="text-lg font-bold text-primary">Rs. {paymentData.amount?.toFixed(2)}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                            If you are not redirected automatically in a few seconds, 
                            please check your pop-up blocker or click the button below.
                        </p>
                        {paymentResponse && (
                            <Button
                                variant="contained"
                                className="mt-4 w-full bg-green-600 hover:bg-green-700"
                                onClick={manualSubmit}
                            >
                                Click to Proceed to eSewa
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                        <MdPayment className="text-3xl text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Redirecting to Payment...
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default EsewaPayment;