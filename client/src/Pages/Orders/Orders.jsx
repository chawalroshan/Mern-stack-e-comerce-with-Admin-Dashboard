import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AccountSidebar from '../../components/AccountSidebar/AccountSidebar';
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Button } from '@mui/material';
import Badge from '../../components/Badge/Badge';
import { MyContext } from '../../App';
import { getUserOrders, getOrderById } from '../../utils/api';
import { BsFillBagCheckFill } from "react-icons/bs";

const Orders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(MyContext);
  const { isLogin, openAlertBox } = context;

  const [orders, setOrders] = useState([]);
  const [singleOrder, setSingleOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpenOrderedProduct, setIsOpenProduct] = useState(null);

  useEffect(() => {
    if (!isLogin) {
      openAlertBox({ type: 'error', msg: 'Please login to view your orders' });
      navigate('/login');
      return;
    }

    if (id) {
      // Fetch single order
      fetchSingleOrder(id);
    } else {
      // Fetch all orders
      fetchOrders();
    }
  }, [id, isLogin]);

  useEffect(() => {
    // Show success message if redirected from payment
    if (location.state?.paymentSuccess) {
      openAlertBox({
        type: 'success',
        msg: `Payment successful! Order ${location.state.orderNumber} has been confirmed.`
      });
    }
  }, [location.state]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching user orders...');
      const response = await getUserOrders();
      
      console.log('Orders response:', response);
      
      if (response.success) {
        const ordersData = response.data || [];
        console.log(`Loaded ${ordersData.length} orders`);
        setOrders(ordersData);
      } else {
        console.error('Failed to fetch orders:', response.message);
        openAlertBox({ type: 'error', msg: response.message || 'Failed to fetch orders' });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      openAlertBox({ type: 'error', msg: 'Error loading orders' });
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await getOrderById(orderId);
      
      if (response.success) {
        setSingleOrder(response.data);
      } else {
        openAlertBox({ type: 'error', msg: response.message || 'Order not found' });
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      openAlertBox({ type: 'error', msg: 'Error loading order' });
      navigate('/orders');
    } finally {
      setLoading(false);
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

  const getStatusColor = (status) => {
    const colors = {
      placed: 'blue',
      confirmed: 'green',
      shipped: 'purple',
      delivered: 'success',
      cancelled: 'red',
      pending: 'yellow',
      paid: 'green',
      failed: 'red'
    };
    return colors[status] || 'gray';
  };

  // Single Order View
  if (id && singleOrder) {
    return (
      <section className='py-10 w-full'>
        <div className='container flex gap-5'>
          <div className='col1 w-[20%]'>
            <AccountSidebar />
          </div>

          <div className="col2 w-[80%]">
            <div className='shadow-md rounded-md p-6 bg-white mt-3'>
              <div className='mb-6'>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/orders')}
                  className="mb-4"
                >
                  ← Back to Orders
                </Button>
                <h2 className='text-2xl font-bold mb-2'>Order Details</h2>
                <p className='text-gray-600'>Order ID: <span className='font-bold text-primary'>{singleOrder.orderId}</span></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Order Status</h3>
                  <Badge status={singleOrder.orderStatus} />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Payment Status</h3>
                  <Badge status={singleOrder.paymentStatus} />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Payment Method</h3>
                  <p className="capitalize">{singleOrder.paymentMethod}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Order Date</h3>
                  <p>{formatDate(singleOrder.createdAt)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-4">
                  {singleOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={item.image || 'https://via.placeholder.com/100'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Rs.{item.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Total: Rs.{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>{singleOrder.shippingAddress?.fullName}</strong></p>
                  <p>{singleOrder.shippingAddress?.street}</p>
                  {singleOrder.shippingAddress?.apartment && <p>{singleOrder.shippingAddress.apartment}</p>}
                  <p>{singleOrder.shippingAddress?.city}, {singleOrder.shippingAddress?.state}</p>
                  <p>{singleOrder.shippingAddress?.zipCode}</p>
                  <p>{singleOrder.shippingAddress?.country}</p>
                  <p className="mt-2">Phone: {singleOrder.shippingAddress?.phone}</p>
                  <p>Email: {singleOrder.shippingAddress?.email}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>Rs.{singleOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping:</span>
                  <span>Rs.{singleOrder.shippingCost?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-primary">Rs.{singleOrder.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Loading State
  if (loading) {
    return (
      <section className='py-10 w-full'>
        <div className='container flex gap-5'>
          <div className='col1 w-[20%]'>
            <AccountSidebar />
          </div>
          <div className="col2 w-[80%]">
            <div className='shadow-md rounded-md p-6 bg-white mt-3 text-center'>
              <p>Loading orders...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty State
  if (!loading && orders.length === 0) {
    return (
      <section className='py-10 w-full'>
        <div className='container flex gap-5'>
          <div className='col1 w-[20%]'>
            <AccountSidebar />
          </div>
          <div className="col2 w-[80%]">
            <div className='shadow-md rounded-md p-6 bg-white mt-3 text-center'>
              <BsFillBagCheckFill className='text-6xl text-gray-300 mx-auto mb-4' />
              <h3 className='text-lg font-semibold mb-2'>No Orders Yet</h3>
              <p className='text-gray-600 mb-4'>You haven't placed any orders yet.</p>
              <Button
                variant="contained"
                className="btn-org"
                onClick={() => navigate('/productListing')}
              >
                Start Shopping
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Orders List View
  return (
    <section className='py-10 w-full'>
      <div className='container flex gap-5'>
        <div className='col1 w-[20%]'>
          <AccountSidebar />
        </div>

        <div className="col2 w-[80%]">
          <div className='shadow-md rounded-md p-1 bg-white mt-3'>
            <div className='py-2 px-3 border-b border-[rgba(0,0,0,0.1)]'>
              <h2 className='text-xl font-bold'>My Orders</h2>
              <p className='mt-2'>There are <span className='font-bold text-primary'>{orders.length}</span> order{orders.length !== 1 ? 's' : ''} in your list.</p>

              <div className="relative overflow-x-auto mt-5">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs text-gray-900 uppercase bg-gray-100">
                    <tr>
                      <th className="px-6 py-3"></th>
                      <th className="px-6 py-3 whitespace-nowrap">Order ID</th>
                      <th className="px-6 py-3 whitespace-nowrap">Items</th>
                      <th className="px-6 py-3 whitespace-nowrap">Total Amount</th>
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
                            <span className='text-primary font-medium'>{order.orderId}</span>
                          </td>
                          <td className="px-6 py-4">{order.items?.length || 0} item(s)</td>
                          <td className="px-6 py-4 font-semibold">Rs.{order.totalAmount?.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <Badge status={order.paymentStatus} />
                          </td>
                          <td className="px-6 py-4">
                            <Badge status={order.orderStatus} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                          <td className="px-6 py-4">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/orders/${order._id}`)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>

                        {isOpenOrderedProduct === index && (
                          <tr>
                            <td colSpan='8' className='bg-[#f9f9f9] px-6 py-4'>
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
                                          <span className='text-primary text-xs'>{item.product?._id?.slice(-8) || 'N/A'}</span>
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
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Orders;
