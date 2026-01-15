import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '@mui/material';

const PaymentFailed = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('orderId');
    const errorMessage = queryParams.get('message');

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="h-12 w-12 text-red-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Payment Failed
                </h1>
                
                <p className="text-gray-600 mb-4">
                    {errorMessage || 'Your payment could not be processed.'}
                </p>
                
                <p className="text-gray-500 text-sm mb-6">
                    Please try again or use a different payment method.
                </p>

                <div className="space-y-3">
                    {orderId && (
                        <Button
                            variant="contained"
                            className="w-full !py-3 bg-primary hover:bg-primary-dark"
                            onClick={() => navigate(`/checkout?orderId=${orderId}`)}
                        >
                            Try Again
                        </Button>
                    )}
                    
                    <Button
                        variant="outlined"
                        className="w-full !py-3"
                        onClick={() => navigate('/checkout')}
                    >
                        Go to Checkout
                    </Button>
                    
                    <Button
                        className="w-full !py-3 text-gray-600 hover:text-gray-800"
                        onClick={() => navigate('/')}
                    >
                        Continue Shopping
                    </Button>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                    If the problem persists, please contact our support team.
                </p>
            </div>
        </div>
    );
};

export default PaymentFailed;