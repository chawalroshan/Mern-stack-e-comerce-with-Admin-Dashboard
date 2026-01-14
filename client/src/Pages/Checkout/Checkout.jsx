import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { BsFillBagCheckFill } from "react-icons/bs";
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const Checkout = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const cart = context.cart || [];
    const userData = context.userData || {};
    const cartTotal = context.getCartTotal();
    const cartItemCount = context.getCartItemCount();
    const shippingCost = cartTotal > 1000 ? 0 : 50;
    const grandTotal = cartTotal + shippingCost;

    const [formData, setFormData] = useState({
        fullName: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        streetAddress: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Nepal',
        paymentMethod: 'cod',
        notes: ''
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [saveAddress, setSaveAddress] = useState(true);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        // Check if cart is empty
        if (cart.length === 0 && !orderPlaced) {
            context.openAlertBox({ 
                type: 'error', 
                msg: 'Your cart is empty. Add items to checkout.' 
            });
            navigate('/cart');
        }
    }, [cart, navigate, context, orderPlaced]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            context.openAlertBox({ 
                type: 'error', 
                msg: 'Please fill all required fields correctly' 
            });
            return;
        }

        try {
            setLoading(true);

            // Prepare order data
            const orderData = {
                user: context.userData?._id || null,
                items: cart.map(item => ({
                    product: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.selectedSize || '',
                    image: item.images?.[0] || ''
                })),
                shippingAddress: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    street: formData.streetAddress,
                    apartment: formData.apartment,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country
                },
                paymentMethod: formData.paymentMethod,
                notes: formData.notes,
                subtotal: cartTotal,
                shippingCost,
                total: grandTotal,
                status: 'pending'
            };

            console.log('Order data:', orderData);

            // Save address if user is logged in and opted to save
            if (context.isLogin && saveAddress) {
                try {
                    await postData('/api/address/create', {
                        fullName: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        street: formData.streetAddress,
                        apartment: formData.apartment,
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode,
                        country: formData.country,
                        isDefault: true
                    });
                } catch (error) {
                    console.error('Error saving address:', error);
                }
            }

            // Create order
            const orderResponse = await postData('/api/orders/create', orderData);
            
            if (orderResponse.success) {
                setOrderId(orderResponse.order?._id || orderResponse.data?._id);
                setOrderPlaced(true);
                
                // Clear cart after successful order
                context.clearCart();
                
                context.openAlertBox({ 
                    type: 'success', 
                    msg: 'Order placed successfully!' 
                });
                
                // Redirect to order confirmation
                setTimeout(() => {
                    navigate(`/orders/${orderResponse.order?._id || orderResponse.data?._id}`);
                }, 2000);
                
            } else {
                context.openAlertBox({ 
                    type: 'error', 
                    msg: orderResponse.message || 'Failed to place order' 
                });
            }

        } catch (error) {
            console.error('Checkout error:', error);
            context.openAlertBox({ 
                type: 'error', 
                msg: 'Error processing your order. Please try again.' 
            });
        } finally {
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <section className="py-16 bg-[#f9f9f9] min-h-[70vh]">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                            <BsFillBagCheckFill className="text-3xl text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
                        <p className="text-gray-600 mb-6">
                            Thank you for your order. Your order ID is: 
                            <span className="font-bold text-primary ml-2">{orderId}</span>
                        </p>
                        <p className="text-gray-600 mb-8">
                            You will receive a confirmation email shortly. You can track your order in the Orders section.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button 
                                className="btn-org !px-8 !py-3"
                                onClick={() => navigate(`/orders/${orderId}`)}
                            >
                                View Order Details
                            </Button>
                            <Button 
                                variant="outlined"
                                className="!px-8 !py-3 !border-primary !text-primary hover:!bg-primary hover:!text-white"
                                onClick={() => navigate('/')}
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-10 bg-[#f9f9f9] min-h-screen">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Checkout</h1>
                    <p className="text-gray-600">
                        Complete your purchase by filling out the form below
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Billing Form */}
                    <div className="w-full lg:w-[70%]">
                        <div className="bg-white shadow-md p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200">
                                Billing Details
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name and Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <TextField 
                                            fullWidth 
                                            label="Full Name *" 
                                            name="fullName"
                                            variant="outlined" 
                                            size="small"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            error={!!errors.fullName}
                                            helperText={errors.fullName}
                                        />
                                    </div>
                                    <div>
                                        <TextField 
                                            fullWidth 
                                            label="Email *" 
                                            name="email"
                                            variant="outlined" 
                                            size="small"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <TextField 
                                        fullWidth 
                                        label="Phone Number *" 
                                        name="phone"
                                        variant="outlined" 
                                        size="small"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        error={!!errors.phone}
                                        helperText={errors.phone}
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Street Address *
                                    </label>
                                    <TextField 
                                        fullWidth 
                                        placeholder="House No. & Street Name"
                                        name="streetAddress"
                                        variant="outlined" 
                                        size="small"
                                        value={formData.streetAddress}
                                        onChange={handleInputChange}
                                        error={!!errors.streetAddress}
                                        helperText={errors.streetAddress}
                                        className="mb-3"
                                    />
                                    <TextField 
                                        fullWidth 
                                        placeholder="Apartment, suite, unit, etc. (optional)"
                                        name="apartment"
                                        variant="outlined" 
                                        size="small"
                                        value={formData.apartment}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* City, State, ZIP */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <TextField 
                                            fullWidth 
                                            label="City *" 
                                            name="city"
                                            variant="outlined" 
                                            size="small"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            error={!!errors.city}
                                            helperText={errors.city}
                                        />
                                    </div>
                                    <div>
                                        <TextField 
                                            fullWidth 
                                            label="State *" 
                                            name="state"
                                            variant="outlined" 
                                            size="small"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            error={!!errors.state}
                                            helperText={errors.state}
                                        />
                                    </div>
                                    <div>
                                        <TextField 
                                            fullWidth 
                                            label="ZIP Code *" 
                                            name="zipCode"
                                            variant="outlined" 
                                            size="small"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            error={!!errors.zipCode}
                                            helperText={errors.zipCode}
                                        />
                                    </div>
                                </div>

                                {/* Country */}
                                <div>
                                    <TextField 
                                        fullWidth 
                                        label="Country" 
                                        name="country"
                                        variant="outlined" 
                                        size="small"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Additional Notes */}
                                <div>
                                    <TextField 
                                        fullWidth 
                                        label="Order Notes (optional)"
                                        name="notes"
                                        variant="outlined" 
                                        size="small"
                                        multiline
                                        rows={3}
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        placeholder="Notes about your order, e.g. special notes for delivery"
                                    />
                                </div>

                                {/* Save Address Checkbox (only for logged in users) */}
                                {context.isLogin && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                                checked={saveAddress}
                                                onChange={(e) => setSaveAddress(e.target.checked)}
                                                color="primary"
                                            />
                                        }
                                        label="Save this address for future orders"
                                    />
                                )}

                                {/* Payment Method */}
                                <div className="pt-6 border-t border-gray-200">
                                    <FormControl component="fieldset" error={!!errors.paymentMethod}>
                                        <FormLabel component="legend" className="text-lg font-semibold mb-4">
                                            Payment Method *
                                        </FormLabel>
                                        <RadioGroup
                                            name="paymentMethod"
                                            value={formData.paymentMethod}
                                            onChange={handleInputChange}
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                                    <Radio value="cod" />
                                                    <div className="ml-3">
                                                        <span className="font-medium">Cash on Delivery</span>
                                                        <p className="text-sm text-gray-600">Pay with cash upon delivery</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                                    <Radio value="card" disabled />
                                                    <div className="ml-3">
                                                        <span className="font-medium text-gray-400">Credit/Debit Card</span>
                                                        <p className="text-sm text-gray-400">Coming soon</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                                    <Radio value="esewa" disabled />
                                                    <div className="ml-3">
                                                        <span className="font-medium text-gray-400">Esewa</span>
                                                        <p className="text-sm text-gray-400">Coming soon</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                        {errors.paymentMethod && (
                                            <p className="text-red-500 text-sm mt-2">{errors.paymentMethod}</p>
                                        )}
                                    </FormControl>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="w-full lg:w-[30%]">
                        <div className="bg-white shadow-md rounded-lg sticky top-6">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200">
                                    Your Order
                                </h2>

                                {/* Order Items */}
                                <div className="max-h-[300px] overflow-y-auto pr-2 mb-6">
                                    <div className="space-y-4">
                                        {cart.map((item) => (
                                            <div key={item._id} className="flex items-center justify-between py-3 border-b border-gray-100">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="img w-14 h-14 min-w-14 overflow-hidden rounded-md bg-gray-100">
                                                        {item.images && item.images[0] ? (
                                                            <img
                                                                src={item.images[0]}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                                <span className="text-xs text-gray-500">No Image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium truncate">{item.name}</h4>
                                                        <div className="flex items-center text-xs text-gray-500">
                                                            <span>Qty: {item.quantity}</span>
                                                            {item.selectedSize && (
                                                                <span className="ml-2">Size: {item.selectedSize}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-primary whitespace-nowrap ml-2">
                                                    Rs.{(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({cartItemCount} items)</span>
                                        <span className="font-medium">Rs.{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                                            {shippingCost === 0 ? 'FREE' : `Rs.${shippingCost.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-200">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">Rs.{grandTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Free Shipping Progress */}
                                {cartTotal < 1000 && (
                                    <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                                        <div className="text-xs text-blue-700 mb-1">
                                            Add Rs.{(1000 - cartTotal).toFixed(2)} more for free shipping
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div 
                                                className="bg-blue-600 h-1.5 rounded-full" 
                                                style={{ width: `${Math.min((cartTotal / 1000) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Place Order Button */}
                                <Button 
                                    type="submit"
                                    className="btn-org !w-full !py-3 !text-lg flex items-center justify-center gap-2"
                                    onClick={handleSubmit}
                                    disabled={loading || cart.length === 0}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Place Order
                                            <BsFillBagCheckFill className="text-xl" />
                                        </>
                                    )}
                                </Button>

                                {/* Return to Cart */}
                                <div className="mt-4 text-center">
                                    <button 
                                        type="button"
                                        onClick={() => navigate('/cart')}
                                        className="text-primary hover:underline text-sm font-bold"
                                    >
                                        ← Return to cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Checkout;