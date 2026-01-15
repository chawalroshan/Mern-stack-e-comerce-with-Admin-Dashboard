import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initiateEsewaPayment } from '../../utils/api';
import toast from 'react-hot-toast';

const EsewaPaymentForm = ({ orderId, amount, orderNumber }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEsewaPayment = async () => {
        if (!orderId) {
            toast.error('Order ID is required');
            return;
        }

        setLoading(true);
        try {
            const response = await initiateEsewaPayment(orderId);
            
            if (response.success) {
                // Create a form and submit it to eSewa
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = response.data.paymentUrl;
                
                // Add all payment data as hidden inputs
                Object.entries(response.data.paymentData).forEach(([key, value]) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value;
                    form.appendChild(input);
                });
                
                // Submit the form
                document.body.appendChild(form);
                form.submit();
            } else {
                toast.error(response.message || 'Failed to initiate payment');
            }
        } catch (error) {
            console.error('Payment initiation error:', error);
            toast.error('Error initiating payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4">Pay with eSewa</h3>
            
            <div className="mb-4">
                <p className="text-gray-600 mb-2">Order: <span className="font-medium">{orderNumber}</span></p>
                <p className="text-gray-600">Amount: <span className="font-bold text-primary">Rs. {amount?.toFixed(2)}</span></p>
            </div>

            <button
                onClick={handleEsewaPayment}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            >
                {loading ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                    </>
                ) : (
                    <>
                        <img 
                            src="https://esewa.com.np/common/images/esewa_logo.png" 
                            alt="eSewa" 
                            className="h-6 mr-2"
                        />
                        Pay with eSewa
                    </>
                )}
            </button>

            <p className="text-xs text-gray-500 mt-3">
                You will be redirected to eSewa's secure payment page.
            </p>
        </div>
    );
};

export default EsewaPaymentForm;