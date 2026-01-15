import NotificationModel from '../models/notification.model.js';

// Create notification
export async function createNotificationController(request, response) {
    try {
        const { userId, type, title, message, orderId, isAdmin } = request.body;

        if (!userId || !type || !title || !message) {
            return response.status(400).json({
                message: 'Missing required fields',
                error: true,
                success: false
            });
        }

        const notification = await NotificationModel.create({
            userId,
            type,
            title,
            message,
            orderId: orderId || null,
            isAdmin: isAdmin || false
        });

        return response.status(201).json({
            message: 'Notification created successfully',
            error: false,
            success: true,
            data: notification
        });

    } catch (error) {
        console.error('Error creating notification:', error);
        return response.status(500).json({
            message: error.message || 'Something went wrong',
            error: true,
            success: false
        });
    }
}

// Get user notifications
export async function getUserNotificationsController(request, response) {
    try {
        const userId = request.userId;

        const notifications = await NotificationModel.find({ userId })
            .populate('orderId', 'orderId totalAmount')
            .sort({ createdAt: -1 })
            .limit(50);

        return response.status(200).json({
            message: 'Notifications fetched successfully',
            error: false,
            success: true,
            data: notifications
        });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        return response.status(500).json({
            message: error.message || 'Something went wrong',
            error: true,
            success: false
        });
    }
}

// Mark notification as read
export async function markNotificationReadController(request, response) {
    try {
        const { id } = request.params;
        const userId = request.userId;

        const notification = await NotificationModel.findOneAndUpdate(
            { _id: id, userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return response.status(404).json({
                message: 'Notification not found',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: 'Notification marked as read',
            error: false,
            success: true,
            data: notification
        });

    } catch (error) {
        console.error('Error marking notification as read:', error);
        return response.status(500).json({
            message: error.message || 'Something went wrong',
            error: true,
            success: false
        });
    }
}

// Mark all notifications as read
export async function markAllNotificationsReadController(request, response) {
    try {
        const userId = request.userId;

        await NotificationModel.updateMany(
            { userId, isRead: false },
            { isRead: true }
        );

        return response.status(200).json({
            message: 'All notifications marked as read',
            error: false,
            success: true
        });

    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return response.status(500).json({
            message: error.message || 'Something went wrong',
            error: true,
            success: false
        });
    }
}

// Get unread notification count
export async function getUnreadNotificationCountController(request, response) {
    try {
        const userId = request.userId;

        const count = await NotificationModel.countDocuments({
            userId,
            isRead: false
        });

        return response.status(200).json({
            message: 'Unread count fetched successfully',
            error: false,
            success: true,
            count
        });

    } catch (error) {
        console.error('Error fetching unread count:', error);
        return response.status(500).json({
            message: error.message || 'Something went wrong',
            error: true,
            success: false
        });
    }
}
