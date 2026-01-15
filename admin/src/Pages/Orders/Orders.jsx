import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import Badge from '../../components/Badge/Badge';
import SearchBox from '../../components/SearchBox/SearchBox';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { getAdminOrders, updateOrderStatus } from '../../utils/api';
import toast from 'react-hot-toast';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpenOrderedProduct, setIsOpenProduct] = useState(null);
    const [statusMenuAnchor, setStatusMenuAnchor] = useState({});
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            console.log('Fetching admin orders...');
            const response = await getAdminOrders();
            
            console.log('Admin orders response:', response);
            
            if (response.success) {
                const ordersData = response.data || [];
                console.log(`Loaded ${ordersData.length} orders`);
                setOrders(ordersData);
            } else {
                console.error('Failed to fetch admin orders:', response.message);
                toast.error(response.message || 'Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching admin orders:', error);
            toast.error('Error loading orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setUpdatingOrderId(orderId);
            const response = await updateOrderStatus(orderId, newStatus);
            
            if (response.success) {
                toast.success('Order status updated successfully');
                // Update local state
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === orderId
                            ? { ...order, orderStatus: newStatus }
                            : order
                    )
                );
            } else {
                toast.error(response.message || 'Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Error updating order status');
        } finally {
            setUpdatingOrderId(null);
            setStatusMenuAnchor({});
        }
    };

    const isShowOrderedProduct = (index) => {
        if (isOpenOrderedProduct === index) {
            setIsOpenProduct(null);
        } else {
            setIsOpenProduct(index);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusOptions = (currentStatus) => {
        const allStatuses = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        return allStatuses.filter(status => status !== currentStatus);
    };

    if (loading) {
        return (
            <div className="card my-4 shadow-md bg-white p-5 rounded-md">
                <div className="text-center py-8">
                    <p>Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card my-4 shadow-md bg-white p-5 rounded-md">
            <div className='flex items-center justify-between px-5 py-5'>
                <h2 className='text-[18px] font-bold'>Recent Orders</h2>
                <div className='w-[25%]'>
                    <SearchBox />
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">No orders found</p>
                </div>
            ) : (
                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-gray-900 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-3"></th>
                                <th className="px-6 py-3 whitespace-nowrap">Order ID</th>
                                <th className="px-6 py-3 whitespace-nowrap">User</th>
                                <th className="px-6 py-3 whitespace-nowrap">Total Amount</th>
                                <th className="px-6 py-3 whitespace-nowrap">Payment Method</th>
                                <th className="px-6 py-3 whitespace-nowrap">Payment Status</th>
                                <th className="px-6 py-3 whitespace-nowrap">Order Status</th>
                                <th className="px-6 py-3 whitespace-nowrap">Date</th>
                                <th className="px-6 py-3 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <React.Fragment key={order._id}>
                                    <tr className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <Button
                                                className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]'
                                                onClick={() => isShowOrderedProduct(index)}
                                            >
                                                {isOpenOrderedProduct === index ? (
                                                    <FaAngleUp className='text-[16px] !text-[rgba(0,0,0,0.8)]' />
                                                ) : (
                                                    <FaAngleDown className='text-[16px] !text-[rgba(0,0,0,0.8)]' />
                                                )}
                                            </Button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className='text-primary font-[600]'>{order.orderId}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium">
                                                    {order.userId?.name || order.shippingAddress?.fullName || 'N/A'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {order.userId?.email || order.shippingAddress?.email || ''}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold">
                                            Rs.{order.totalAmount?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 capitalize">
                                            {order.paymentMethod || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge status={order.paymentStatus || 'pending'} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge status={order.orderStatus || 'placed'} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <FormControl size="small" className="min-w-[150px]">
                                                <InputLabel>Update Status</InputLabel>
                                                <Select
                                                    value={order.orderStatus || 'placed'}
                                                    label="Update Status"
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    disabled={updatingOrderId === order._id}
                                                >
                                                    <MenuItem value="placed">Placed</MenuItem>
                                                    <MenuItem value="confirmed">Confirmed</MenuItem>
                                                    <MenuItem value="shipped">Shipped</MenuItem>
                                                    <MenuItem value="delivered">Delivered</MenuItem>
                                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </td>
                                    </tr>

                                    {isOpenOrderedProduct === index && (
                                        <tr>
                                            <td colSpan='9' className='bg-[#f9f9f9] px-6 py-4'>
                                                <div className="mb-4">
                                                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                                                    <div className="bg-white p-3 rounded">
                                                        <p><strong>{order.shippingAddress?.fullName}</strong></p>
                                                        <p>{order.shippingAddress?.street}</p>
                                                        {order.shippingAddress?.apartment && (
                                                            <p>{order.shippingAddress.apartment}</p>
                                                        )}
                                                        <p>
                                                            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                                                        </p>
                                                        <p>{order.shippingAddress?.country}</p>
                                                        <p className="mt-2">Phone: {order.shippingAddress?.phone}</p>
                                                        <p>Email: {order.shippingAddress?.email}</p>
                                                    </div>
                                                </div>

                                                <div className="relative overflow-x-auto">
                                                    <table className="w-full text-sm text-left text-gray-700">
                                                        <thead className="text-xs text-gray-900 uppercase bg-gray-100">
                                                            <tr>
                                                                <th className="px-6 py-3">Product</th>
                                                                <th className="px-6 py-3 whitespace-nowrap">Name</th>
                                                                <th className="px-6 py-3 whitespace-nowrap">Image</th>
                                                                <th className="px-6 py-3 whitespace-nowrap">Quantity</th>
                                                                <th className="px-6 py-3 whitespace-nowrap">Price</th>
                                                                <th className="px-6 py-3 whitespace-nowrap">Subtotal</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {order.items?.map((item, itemIndex) => (
                                                                <tr key={itemIndex} className="bg-white">
                                                                    <td className="px-6 py-4">
                                                                        <span className='text-primary text-xs'>
                                                                            {item.product?._id?.slice(-8) || 'N/A'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4">{item.name}</td>
                                                                    <td className="px-6 py-4">
                                                                        <img
                                                                            src={item.image || 'https://via.placeholder.com/50'}
                                                                            alt={item.name}
                                                                            className='w-[40px] h-[40px] object-cover rounded-md'
                                                                        />
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                                                    <td className="px-6 py-4">Rs.{item.price?.toFixed(2)}</td>
                                                                    <td className="px-6 py-4 font-semibold">
                                                                        Rs.{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="mt-4 flex justify-end gap-4 pt-4 border-t">
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">Subtotal: Rs.{order.subtotal?.toFixed(2)}</p>
                                                        <p className="text-sm text-gray-600">Shipping: Rs.{order.shippingCost?.toFixed(2)}</p>
                                                        <p className="text-lg font-bold text-primary mt-2">
                                                            Total: Rs.{order.totalAmount?.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Orders;
