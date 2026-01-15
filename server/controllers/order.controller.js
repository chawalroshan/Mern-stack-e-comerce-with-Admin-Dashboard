import OrderModel from '../models/order.model.js';
import CartProductModel from '../models/cartProduct.model.js';
import NotificationModel from '../models/notification.model.js';
import UserModel from '../models/user.model.js';
import ProductModel from '../models/product.model.js'; // Import to ensure model is registered

// Place order
export async function placeOrderController(request, response) {
    try {
        const userId = request.userId;
        const {
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            shippingCost,
            totalAmount,
            notes
        } = request.body;

        // Validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return response.status(400).json({
                message: 'Order must contain at least one item',
                error: true,
                success: false
            });
        }

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.email) {
            return response.status(400).json({
                message: 'Shipping address is required',
                error: true,
                success: false
            });
        }

        if (!paymentMethod) {
            return response.status(400).json({
                message: 'Payment method is required',
                error: true,
                success: false
            });
        }

        // Create order
        const order = new OrderModel({
            userId,
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            shippingCost,
            totalAmount,
            notes,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
            orderStatus: 'placed'
        });

        const savedOrder = await order.save();

        // Clear user's cart from database
        try {
            await CartProductModel.deleteMany({ userId });
            // Also clear from user's shopping_cart array
            await UserModel.updateOne(
                { _id: userId },
                { $set: { shopping_cart: [] } }
            );
        } catch (cartError) {
            console.error('Error clearing cart:', cartError);
            // Don't fail the order if cart clearing fails
        }

        // Create user notification
        try {
            await NotificationModel.create({
                userId,
                type: 'order',
                title: 'Order Placed Successfully',
                message: 'We have received your order and we will reach you soon.',
                orderId: savedOrder._id,
                isRead: false,
                isAdmin: false
            });
        } catch (notifError) {
            console.error('Error creating user notification:', notifError);
        }

        // Create admin notification
        try {
            // Find admin users (you can modify this based on your admin logic)
            const adminUsers = await UserModel.find({ role: 'ADMIN' });
            
            for (const admin of adminUsers) {
                await NotificationModel.create({
                    userId: admin._id,
                    type: 'admin',
                    title: 'New Order Received',
                    message: `New order ${savedOrder.orderId} placed by user. Total amount: Rs.${totalAmount.toFixed(2)}`,
                    orderId: savedOrder._id,
                    isRead: false,
                    isAdmin: true
                });
            }
        } catch (adminNotifError) {
            console.error('Error creating admin notification:', adminNotifError);
        }

        return response.status(201).json({
            message: 'Order placed successfully',
            error: false,
            success: true,
            order: savedOrder
        });

    } catch (error) {
        console.error('Error placing order:', error);
        return response.status(500).json({
            message: error.message || 'Something went wrong',
            error: true,
            success: false
        });
    }
}

// Get user orders
export async function getUserOrdersController(request, response) {
    try {
        const userId = request.userId;

        const orders = await OrderModel.find({ userId })
            .populate({
                path: 'items.product',
                select: 'name images price',
                model: 'product',
                options: { strictPopulate: false } // Don't fail if product is deleted
            })
            .sort({ createdAt: -1 });

        console.log(`Found ${orders.length} orders for user ${userId}`);

        return response.status(200).json({
            message: 'Orders fetched successfully',
            error: false,
            success: true,
            data: orders
        });

    } catch (error) {
        console.error('Error fetching user orders:', error);
        return response.status(500).json({
            message: error.message || 'Something went wrong',
            error: true,
            success: false
        });
    }
}

// Get admin orders (all orders)
export async function getAdminOrdersController(request, response) {
    try {
        // Check if user is admin (you can add admin check middleware)
        const orders = await OrderModel.find({})
            .populate('userId', 'name email')
            .populate({
                path: 'items.product',
                select: 'name images price',
                model: 'product',
                options: { strictPopulate: false } // Don't fail if product is deleted
            })
            .sort({ createdAt: -1 });

        console.log(`Found ${orders.length} total orders`);

        return response.status(200).json({
            message: 'Orders fetched successfully',
            error: false,
            success: true,
            data: orders
        });

    } catch (error) {
        console.error('Error fetching admin orders:', error);
        return response.status(500).json({
            message: error.message || 'Something went wrong',
            error: true,
            success: false
        });
    }
}

// Get single order by ID
export async function getOrderByIdController(request, response) {
    try {
        const { id } = request.params;
        const userId = request.userId;

        const order = await OrderModel.findOne({ _id: id, userId })
            .populate({
                path: 'items.product',
                select: 'name images price',
                model: 'product',
                options: { strictPopulate: false } // Don't fail if product is deleted
            })
            .populate('userId', 'name email');

        if (!order) {
            return response.status(404).json({
                message: 'Order not found',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: 'Order fetched successfully',
            error: false,
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Error fetching order:', error);
        return response.status(500).json({
            message: error.message || 'Something went wrong',
            error: true,
            success: false
        });
    }
}

// Update order status (for admin)
export async function updateOrderStatusController(request, response) {
    try {
        const { id } = request.params;
        const { orderStatus } = request.body;

        if (!orderStatus) {
            return response.status(400).json({
                message: 'Order status is required',
                error: true,
                success: false
            });
        }

        const order = await OrderModel.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true }
        );

        if (!order) {
            return response.status(404).json({
                message: 'Order not found',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: 'Order status updated successfully',
            error: false,
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        return response.status(500).json({
            message: error.message || 'Something went wrong',
            error: true,
            success: false
        });
    }
}
