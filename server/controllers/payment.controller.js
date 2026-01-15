import OrderModel from '../models/order.model.js';
import PaymentModel from '../models/payment.model.js';
import NotificationModel from '../models/notification.model.js';
import getEsewaConfig from '../config/esewa.config.js';
import axios from 'axios';
import { generateHmacSha256Hash, safeStringify } from '../utils/utils.js';


const esewaConfig = getEsewaConfig();

// Initiate REAL eSewa payment
export async function initiateEsewaPaymentController(request, response) {
    try {
        const { orderId } = request.body;
        const userId = request.userId;

        if (!orderId) {
            return response.status(400).json({
                message: 'Order ID is required',
                error: true,
                success: false
            });
        }

        // Find order
        const order = await OrderModel.findOne({ _id: orderId, userId });

        if (!order) {
            return response.status(404).json({
                message: 'Order not found',
                error: true,
                success: false
            });
        }

        if (order.paymentMethod !== 'esewa') {
            return response.status(400).json({
                message: 'This order is not for eSewa payment',
                error: true,
                success: false
            });
        }

        // Generate unique transaction UUID
        const transactionUuid = `ESEWA-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        
        // Prepare payment data for eSewa
        const amount = order.totalAmount.toString();
        
        let paymentData = {
            amount: amount,
            failure_url: esewaConfig.failureUrl,
            product_delivery_charge: "0",
            product_service_charge: "0",
            product_code: esewaConfig.merchantId,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            success_url: esewaConfig.successUrl,
            tax_amount: "0",
            total_amount: amount,
            transaction_uuid: transactionUuid,
        };

        // Generate signature
        const dataString = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
        const signature = generateHmacSha256Hash(dataString, esewaConfig.secret);
        paymentData = { ...paymentData, signature };

        // First, create a payment record in database
        const paymentRecord = new PaymentModel({
            order_id: orderId,
            product_id: transactionUuid,
            amount: order.totalAmount,
            status: "INITIATED",
            user_id: userId,
            payment_gateway: 'esewa'
        });
        await paymentRecord.save();

        // Update order with payment reference
        order.paymentId = transactionUuid;
        await order.save();

        // Return payment URL to frontend
        return response.status(200).json({
            message: 'eSewa payment initiated successfully',
            error: false,
            success: true,
            data: {
                paymentUrl: esewaConfig.esewaPaymentUrl,
                paymentData: paymentData,
                transactionUuid: transactionUuid,
                orderId: order._id,
                orderNumber: order.orderId,
                amount: order.totalAmount
            }
        });

    } catch (error) {
        console.error('Error initiating eSewa payment:', error);
        return response.status(500).json({
            message: error.message || 'Something went wrong',
            error: true,
            success: false
        });
    }
}

// Verify eSewa payment success (callback from eSewa)
export async function esewaPaymentSuccessController(request, response) {
    try {
        const { data } = request.query; // eSewa sends data as query parameter
        const userId = request.userId;

        if (!data) {
            return response.status(400).json({
                message: 'Payment data is missing',
                error: true,
                success: false
            });
        }

        // Decode the base64 data
        const decodedData = base64Decode(data);
        const { transaction_uuid, status, total_amount } = decodedData;

        // Find payment record
        const payment = await PaymentModel.findOne({ 
            product_id: transaction_uuid,
            user_id: userId 
        });

        if (!payment) {
            return response.status(404).json({
                message: 'Payment record not found',
                error: true,
                success: false
            });
        }

        // Find associated order
        const order = await OrderModel.findOne({ 
            _id: payment.order_id,
            userId: userId 
        });

        if (!order) {
            return response.status(404).json({
                message: 'Order not found',
                error: true,
                success: false
            });
        }

        // Verify payment with eSewa status check
        const verificationResponse = await verifyEsewaPayment(
            transaction_uuid, 
            total_amount
        );

        if (verificationResponse.status === "COMPLETE") {
            // Update payment status
            payment.status = "COMPLETE";
            payment.verified_at = new Date();
            await payment.save();

            // Update order status
            order.paymentStatus = 'paid';
            order.orderStatus = 'confirmed';
            await order.save();

            // Create success notification
            await NotificationModel.create({
                userId,
                type: 'payment',
                title: 'Payment Successful',
                message: `Your payment of Rs.${total_amount} for order ${order.orderId} has been received successfully.`,
                orderId: order._id,
                isRead: false,
                isAdmin: false
            });

            // Redirect to frontend success page
            return response.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?orderId=${order._id}&transactionId=${transaction_uuid}`);
            
        } else {
            // Payment not complete
            payment.status = "PENDING";
            await payment.save();

            return response.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/pending?orderId=${order._id}`);
        }

    } catch (error) {
        console.error('Error processing eSewa payment success:', error);
        return response.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/error?message=Payment processing failed`);
    }
}

// Handle eSewa payment failure
export async function esewaPaymentFailureController(request, response) {
    try {
        const { data } = request.query;
        const userId = request.userId;

        if (!data) {
            return response.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/error`);
        }

        const decodedData = base64Decode(data);
        const { transaction_uuid } = decodedData;

        // Find and update payment record
        const payment = await PaymentModel.findOne({ 
            product_id: transaction_uuid,
            user_id: userId 
        });

        if (payment) {
            payment.status = "FAILED";
            payment.failed_at = new Date();
            await payment.save();

            // Find and update order
            const order = await OrderModel.findOne({ _id: payment.order_id });
            if (order) {
                order.paymentStatus = 'failed';
                await order.save();

                // Create failure notification
                await NotificationModel.create({
                    userId,
                    type: 'payment',
                    title: 'Payment Failed',
                    message: `Payment for order ${order.orderId} failed. Please try again.`,
                    orderId: order._id,
                    isRead: false,
                    isAdmin: false
                });
            }
        }

        // Redirect to frontend failure page
        return response.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failed?orderId=${payment?.order_id}`);

    } catch (error) {
        console.error('Error processing eSewa payment failure:', error);
        return response.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/error`);
    }
}

// Helper function to verify payment with eSewa
async function verifyEsewaPayment(transactionUuid, totalAmount) {
    try {
        const paymentData = {
            product_code: esewaConfig.merchantId,
            total_amount: totalAmount,
            transaction_uuid: transactionUuid,
        };

        const response = await axios.get(esewaConfig.statusCheckUrl, {
            params: paymentData,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error verifying eSewa payment:', error);
        throw error;
    }
}

// Helper function to decode base64
function base64Decode(base64) {
    try {
        // Convert Base64Url to standard Base64
        const standardBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding if necessary
        const padding = '='.repeat((4 - standardBase64.length % 4) % 4);
        const base64WithPadding = standardBase64 + padding;
        // Decode Base64 to UTF-8 string
        const decoded = Buffer.from(base64WithPadding, 'base64').toString('utf8');
        return JSON.parse(decoded);
    } catch (error) {
        console.error('Base64 decode error:', error);
        throw new Error('Invalid payment data');
    }
}