import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { BsFillBagCheckFill } from "react-icons/bs";
import { MyContext } from '../../App';
import { postData, placeOrder, initiateEsewaPayment } from '../../utils/api';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { MdAccountBalanceWallet, MdLocalShipping, MdPayment } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import toast from 'react-hot-toast';

const Checkout = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const cart = context.cart || [];
    const userData = context.userData || {};
    const cartTotal = context.getCartTotal();
    const cartItemCount = context.getCartItemCount();
    const shippingCost = cartTotal > 1000 ? 0 : 100;
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

    // Load saved addresses if user is logged in
    useEffect(() => {
        if (context.isLogin && userData.defaultAddress) {
            const address = userData.defaultAddress;
            setFormData(prev => ({
                ...prev,
                streetAddress: address.street || '',
                apartment: address.apartment || '',
                city: address.city || '',
                state: address.state || '',
                zipCode: address.zipCode || '',
                country: address.country || 'Nepal'
            }));
        }
    }, [context.isLogin, userData.defaultAddress]);

    useEffect(() => {
        // Check if cart is empty
        if (cart.length === 0 && !orderPlaced) {
            toast.error('Your cart is empty. Add items to checkout.');
            navigate('/cart');
        }
    }, [cart, navigate, orderPlaced]);

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
        else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Enter valid 10-digit phone number';
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
            toast.error('Please fill all required fields correctly');
            return;
        }

        try {
            setLoading(true);

            // Prepare order data
            const orderData = {
                items: cart.map(item => ({
                    product: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.selectedSize || '',
                    image: item.images?.[0] || '',
                    color: item.selectedColor || ''
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
                totalAmount: grandTotal
            };

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
            const orderResponse = await placeOrder(orderData);
            
            if (orderResponse.success) {
                const createdOrderId = orderResponse.order?._id || orderResponse.data?._id;
                const orderNumber = orderResponse.order?.orderId || orderResponse.data?.orderId;
                setOrderId(createdOrderId);
                
                // If payment method is eSewa, submit directly to eSewa
                if (formData.paymentMethod === 'esewa') {
                    try {
                        // Initiate eSewa payment
                        const paymentResponse = await initiateEsewaPayment(createdOrderId);
                        
                        if (paymentResponse.success && paymentResponse.data) {
                            // Store order ID in session storage for payment success page
                            sessionStorage.setItem('lastOrderId', createdOrderId);
                            sessionStorage.setItem('lastOrderNumber', orderNumber);
                            
                            console.log('eSewa Payment URL:', paymentResponse.data.paymentUrl);
                            console.log('eSewa Payment Data:', paymentResponse.data.paymentData);
                            
                            // Create and submit form directly to eSewa
                            const form = document.createElement('form');
                            form.method = 'POST';
                            form.action = paymentResponse.data.paymentUrl;
                            form.style.display = 'none';
                            form.target = '_self'; // Submit in same window
                            
                            // Add all payment data as hidden inputs
                            Object.entries(paymentResponse.data.paymentData).forEach(([key, value]) => {
                                const input = document.createElement('input');
                                input.type = 'hidden';
                                input.name = key;
                                input.value = String(value); // Ensure value is string
                                form.appendChild(input);
                                console.log(`Added field: ${key} = ${value}`);
                            });
                            
                            // Add form to body and submit
                            document.body.appendChild(form);
                            console.log('Submitting form to eSewa...');
                            
                            // Submit form - this will redirect to eSewa
                            form.submit();
                            
                            // Clear cart after initiating payment
                            context.clearCart();
                        } else {
                            context.openAlertBox({
                                type: 'error',
                                msg: paymentResponse.message || 'Failed to initiate payment'
                            });
                            setLoading(false);
                        }
                    } catch (paymentError) {
                        console.error('Error initiating eSewa payment:', paymentError);
                        context.openAlertBox({
                            type: 'error',
                            msg: 'Error initiating payment. Please try again.'
                        });
                        setLoading(false);
                    }
                } 
                // If payment method is COD
                else if (formData.paymentMethod === 'cod') {
                    // COD - show success message
                    setOrderPlaced(true);
                    
                    // Clear cart after successful order
                    context.clearCart();
                    
                    toast.success('Order placed successfully! We will contact you soon.');
                    
                    // Redirect to order confirmation
                    setTimeout(() => {
                        navigate(`/orders/${createdOrderId}`);
                    }, 2000);
                }
                
            } else {
                toast.error(orderResponse.message || 'Failed to place order');
            }

        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Error processing your order. Please try again.');
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
                        <p className="text-gray-600 mb-4">
                            Thank you for your order. Your order ID is: 
                            <span className="font-bold text-primary ml-2">{orderId}</span>
                        </p>
                        <p className="text-gray-600 mb-6">
                            We will contact you shortly for delivery details.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button 
                                variant="contained"
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
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                                1
                            </div>
                            <span className="font-medium">Cart</span>
                        </div>
                        <div className="w-16 h-1 bg-gray-300 mx-4"></div>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                                2
                            </div>
                            <span className="font-medium text-primary">Checkout</span>
                        </div>
                        <div className="w-16 h-1 bg-gray-300 mx-4"></div>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">
                                3
                            </div>
                            <span className="font-medium text-gray-500">Confirmation</span>
                        </div>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Checkout</h1>
                    <p className="text-gray-600">
                        Complete your purchase by filling out the form below
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Billing Form */}
                    <div className="w-full lg:w-[70%]">
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            {/* Personal Information */}
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <MdAccountBalanceWallet className="mr-2 text-primary" />
                                    Personal Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <div className="mt-4">
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
                                        placeholder="98XXXXXXXX"
                                    />
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <MdLocalShipping className="mr-2 text-primary" />
                                    Shipping Address
                                </h2>
                                
                                <div className="mb-4">
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
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <TextField 
                                        fullWidth 
                                        label="Apartment, suite, unit, etc. (optional)"
                                        name="apartment"
                                        variant="outlined" 
                                        size="small"
                                        value={formData.apartment}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                
                                <div className="mt-4">
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
                            </div>

                            {/* Order Notes */}
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
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

                            {/* Save Address Checkbox */}
                            {context.isLogin && (
                                <div className="p-6 border-b border-gray-200">
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
                                </div>
                            )}

                            {/* Payment Method */}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-6 flex items-center">
                                    <MdPayment className="mr-2 text-primary" />
                                    Payment Method *
                                </h2>
                                <FormControl component="fieldset" error={!!errors.paymentMethod} className="w-full">
                                    <RadioGroup
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleInputChange}
                                        className="space-y-3"
                                    >
                                        {/* Cash on Delivery */}
                                        <div className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <Radio value="cod" className="mt-1" />
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center">
                                                    <TbTruckDelivery className="text-gray-600 mr-2" />
                                                    <span className="font-medium">Cash on Delivery</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Pay with cash upon delivery. Additional delivery charges may apply.
                                                </p>
                                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                                    <span className="bg-gray-100 px-2 py-1 rounded">Available</span>
                                                    <span className="ml-2">Delivery in 3-5 business days</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* eSewa */}
                                        <div className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'esewa' ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <Radio value="esewa" className="mt-1" />
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center">
                                                    <img 
                                                        src="https://esewa.com.np/common/images/esewa_logo.png" 
                                                        alt="eSewa" 
                                                        className="h-5 mr-2"
                                                    />
                                                    <span className="font-medium">eSewa</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Pay securely with eSewa. You will be redirected to eSewa's payment page.
                                                </p>
                                                <div className="mt-2 flex items-center text-sm">
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Secure</span>
                                                    <span className="ml-2 text-gray-500">Instant confirmation</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Credit/Debit Card (Coming Soon) */}
                                        <div className="flex items-start p-4 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
                                            <Radio value="card" disabled className="mt-1" />
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center">
                                                    <FaCreditCard className="text-gray-400 mr-2" />
                                                    <span className="font-medium text-gray-400">Credit/Debit Card</span>
                                                </div>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Pay with your credit or debit card (Coming Soon)
                                                </p>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                    {errors.paymentMethod && (
                                        <p className="text-red-500 text-sm mt-2">{errors.paymentMethod}</p>
                                    )}
                                </FormControl>

                                {/* Payment Method Instructions */}
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        {formData.paymentMethod === 'cod' ? 
                                            "You'll pay the delivery person in cash when you receive your order." :
                                            formData.paymentMethod === 'esewa' ?
                                            "You'll be redirected to eSewa's secure payment page to complete your transaction." :
                                            "Select a payment method to continue."
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="w-full lg:w-[30%]">
                        <div className="bg-white shadow-md rounded-lg sticky top-6">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200">
                                    Order Summary
                                </h2>

                                {/* Order Items */}
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-700 mb-3">Items ({cartItemCount})</h3>
                                    <div className="max-h-[300px] overflow-y-auto pr-2">
                                        <div className="space-y-3">
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
                                                            <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 mt-1">
                                                                <span>Qty: {item.quantity}</span>
                                                                {item.selectedSize && (
                                                                    <>
                                                                        <span className="text-gray-300">•</span>
                                                                        <span>Size: {item.selectedSize}</span>
                                                                    </>
                                                                )}
                                                                {item.selectedColor && (
                                                                    <>
                                                                        <span className="text-gray-300">•</span>
                                                                        <span>Color: {item.selectedColor}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-600 mt-1">
                                                                Rs.{item.price.toFixed(2)} each
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-semibold text-primary whitespace-nowrap ml-2">
                                                        Rs.{(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
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
                                        <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
                                    </div>
                                </div>

                                {/* Free Shipping Progress */}
                                {cartTotal < 1000 && (
                                    <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center justify-between text-sm text-blue-800 mb-1">
                                            <span>Free shipping on orders over Rs.1000</span>
                                            <span className="font-semibold">
                                                Rs.{(1000 - cartTotal).toFixed(2)} to go
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                                style={{ width: `${Math.min((cartTotal / 1000) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Place Order Button */}
                                <Button 
                                    type="submit"
                                    className="btn-org !w-full !py-3 !text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow"
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
                                            {formData.paymentMethod === 'cod' ? 'Place Order (COD)' : 'Proceed to Payment'}
                                            <BsFillBagCheckFill className="text-xl" />
                                        </>
                                    )}
                                </Button>

                                {/* Security Note */}
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center text-green-800">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">Secure checkout</span>
                                    </div>
                                    <p className="text-xs text-green-700 mt-1">
                                        Your personal information is protected with 256-bit SSL encryption
                                    </p>
                                </div>

                                {/* Return to Cart */}
                                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                                    <button 
                                        type="button"
                                        onClick={() => navigate('/cart')}
                                        className="text-primary hover:text-primary-dark hover:underline text-sm font-medium flex items-center justify-center"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Return to cart
                                    </button>
                                </div>

                                {/* Help Section */}
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-700 mb-2">Need help?</h4>
                                    <div className="space-y-2">
                                        <a href="/contact" className="block text-sm text-primary hover:underline">
                                            Contact Customer Support
                                        </a>
                                        <a href="/faq" className="block text-sm text-primary hover:underline">
                                            View FAQ
                                        </a>
                                        <a href="/shipping-policy" className="block text-sm text-primary hover:underline">
                                            Shipping & Delivery Policy
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <div className="text-gray-400 mb-2">
                            <TbTruckDelivery className="text-2xl mx-auto" />
                        </div>
                        <p className="text-sm font-medium">Free Shipping</p>
                        <p className="text-xs text-gray-500">On orders over Rs.1000</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <div className="text-gray-400 mb-2">
                            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium">Secure Payment</p>
                        <p className="text-xs text-gray-500">100% Secure & Safe</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <div className="text-gray-400 mb-2">
                            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium">Quality Guarantee</p>
                        <p className="text-xs text-gray-500">Best Quality Products</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <div className="text-gray-400 mb-2">
                            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium">Easy Returns</p>
                        <p className="text-xs text-gray-500">7 Days Return Policy</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Checkout;