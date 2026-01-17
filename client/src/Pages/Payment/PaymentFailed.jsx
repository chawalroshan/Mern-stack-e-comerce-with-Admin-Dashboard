import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@mui/material';
import { MyContext } from '../../App';

const PaymentFailed = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const context = useContext(MyContext);

    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('orderId');
    const errorMessage = queryParams.get('message');

    useEffect(() => {
        // Show error notification
        context.openAlertBox && context.openAlertBox({
            type: 'error',
            msg: errorMessage || 'Payment failed. Please try again.'
        });
    }, [errorMessage]);

    const handleRetryPayment = () => {
        if (orderId) {
            // If we have orderId, go to checkout with that order
            navigate(`/checkout?retry=true&orderId=${orderId}`);
        } else {
            // Otherwise go to cart
            navigate('/cart');
        }
    };

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
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="text-left">
                            <p className="text-sm text-yellow-800 font-medium mb-1">
                                What happened?
                            </p>
                            <p className="text-xs text-yellow-700">
                                Your payment was not successful. This could be due to:
                            </p>
                            <ul className="text-xs text-yellow-700 list-disc list-inside mt-2 space-y-1">
                                <li>Insufficient funds</li>
                                <li>Network connectivity issues</li>
                                <li>Payment gateway timeout</li>
                                <li>Transaction cancelled by user</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {orderId && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Order ID:</span> {orderId}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Your order has been created but payment is pending. 
                            You can retry the payment or choose a different payment method.
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    <Button
                        variant="contained"
                        className="w-full !py-3 bg-primary hover:bg-primary-dark"
                        onClick={handleRetryPayment}
                    >
                        {orderId ? 'Retry Payment' : 'Go to Cart'}
                    </Button>
                    
                    {orderId && (
                        <Button
                            variant="outlined"
                            className="w-full !py-3 !border-primary !text-primary hover:!bg-primary hover:!text-white"
                            onClick={() => navigate(`/orders/${orderId}`)}
                        >
                            View Order Details
                        </Button>
                    )}
                    
                    <Button
                        variant="text"
                        className="w-full !py-3 text-gray-600 hover:text-gray-800"
                        onClick={() => navigate('/')}
                    >
                        Continue Shopping
                    </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                        💡 <span className="font-medium">Need help?</span>
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                        Contact our support team if you continue experiencing issues.
                    </p>
                    <Button
                        size="small"
                        className="!mt-2"
                        onClick={() => navigate('/contact')}
                    >
                        Contact Support
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;