import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { getOrderById } from '../../utils/api';
import { Button } from '@mui/material';
import { MyContext } from '../../App';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const context = useContext(MyContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const orderId = queryParams.get('orderId');
        const transactionId = queryParams.get('transactionId');

        console.log('Payment Success Page - OrderID:', orderId);
        console.log('Payment Success Page - TransactionID:', transactionId);

        if (orderId) {
            fetchOrderDetails(orderId);
        } else {
            // If no orderId in URL, check session storage
            const savedOrderId = sessionStorage.getItem('lastOrderId');
            if (savedOrderId) {
                fetchOrderDetails(savedOrderId);
            } else {
                setLoading(false);
                context.openAlertBox && context.openAlertBox({
                    type: 'warning',
                    msg: 'Order details not found'
                });
            }
        }

        // Clear session storage after loading
        sessionStorage.removeItem('lastOrderId');
        sessionStorage.removeItem('lastOrderNumber');
    }, [location]);

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await getOrderById(orderId);
            console.log('Order details response:', response);
            
            if (response.success) {
                setOrder(response.data);
                
                // Show success message
                context.openAlertBox && context.openAlertBox({
                    type: 'success',
                    msg: 'Payment completed successfully!'
                });
            } else {
                context.openAlertBox && context.openAlertBox({
                    type: 'error',
                    msg: response.message || 'Failed to fetch order details'
                });
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            context.openAlertBox && context.openAlertBox({
                type: 'error',
                msg: 'Error loading order details'
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600">Loading order details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Payment Successful!
                </h1>
                
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your payment has been processed successfully.
                </p>

                {order ? (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="text-left space-y-2">
                            <p><span className="font-medium">Order Number:</span> {order.orderId}</p>
                            <p><span className="font-medium">Total Amount:</span> Rs. {order.totalAmount?.toFixed(2)}</p>
                            <p><span className="font-medium">Payment Status:</span> 
                                <span className="text-green-600 font-semibold ml-2 capitalize">
                                    {order.paymentStatus || 'Paid'}
                                </span>
                            </p>
                            <p><span className="font-medium">Order Status:</span> 
                                <span className="text-blue-600 font-semibold ml-2 capitalize">
                                    {order.orderStatus || 'Confirmed'}
                                </span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800">
                            Payment was successful! Please check your email for order confirmation.
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    {order && (
                        <Button
                            variant="contained"
                            className="w-full !py-3 bg-primary hover:bg-primary-dark"
                            onClick={() => navigate(`/orders/${order._id}`)}
                        >
                            View Order Details
                        </Button>
                    )}
                    
                    <Button
                        variant="outlined"
                        className="w-full !py-3 !border-primary !text-primary hover:!bg-primary hover:!text-white"
                        onClick={() => navigate('/orders')}
                    >
                        View All Orders
                    </Button>
                    
                    <Button
                        variant="text"
                        className="w-full !py-3"
                        onClick={() => navigate('/')}
                    >
                        Continue Shopping
                    </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                        📧 You will receive an email confirmation shortly with your order details.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;