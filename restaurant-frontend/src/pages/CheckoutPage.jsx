import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} from "../features/cart/cartSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  CreditCard, 
  MapPin, 
  Clock, 
  User, 
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Loader
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CheckoutPage = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form states
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxRate = 0.18; // 18% GST
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!tableNumber.trim()) {
      newErrors.tableNumber = "Table number is required";
    }
    
    if (!customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (items.length === 0) {
      newErrors.items = "Your cart is empty";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle quantity update
  const handleQuantityUpdate = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(itemId));
    } else if (newQuantity > 0 && newQuantity <= 99) {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  // Handle order submission
  const handleProceed = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const orderData = {
        tableNumber: tableNumber.trim(),
        items: items.map((i) => ({
          menuItemId: i._id,
          quantity: i.quantity,
        })),
        totalPrice: total,
        paymentMethod,
        notes: notes.trim()||" ",
        placedBy: customerName.trim()||" ",
      };

      const res = await axios.post(`${API_BASE_URL}/orders`, orderData);

      if (res.data?.error) {
        setErrors({ submit: res.data.error });
      } else {
        dispatch(clearCart());
        navigate(`/order-status/${res.data._id}`);
      }
    } catch (err) {
      setErrors({ 
        submit: err.response?.data?.error || "Order creation failed. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-gray-400 mb-6">
            <ShoppingCart size={80} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 text-center max-w-md">
            Add some delicious items to your cart before proceeding to checkout
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          </div>
          <div className="text-sm text-gray-600">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items & Customer Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ShoppingCart size={20} className="mr-2" />
                Your Order
              </h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    {/* Item Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    
                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600">₹{item.price} each</p>
                      <p className="text-sm font-semibold text-orange-500">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityUpdate(item._id, item.quantity - 1)}
                        className="p-1 hover:bg-white rounded-full transition-colors"
                        disabled={isLoading}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityUpdate(item._id, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded-full transition-colors"
                        disabled={isLoading}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => dispatch(removeFromCart(item._id))}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      disabled={isLoading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User size={20} className="mr-2" />
                Customer Information
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Table Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-1" />
                    Table Number *
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                      errors.tableNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., A1, 5, B12"
                    disabled={isLoading}
                  />
                  {errors.tableNumber && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.tableNumber}
                    </p>
                  )}
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-1" />
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                      errors.customerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your name"
                    disabled={isLoading}
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.customerName}
                    </p>
                  )}
                </div>
              </div>

              {/* Special Notes */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageCircle size={16} className="inline mr-1" />
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Any special requests or dietary requirements..."
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard size={20} className="mr-2" />
                Payment Method
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === "cash"
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  <div className="font-semibold">Cash</div>
                  <div className="text-sm text-gray-600">Pay at the table</div>
                </button>
                
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === "card"
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  <div className="font-semibold">Card</div>
                  <div className="text-sm text-gray-600">Pay with card</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18% GST)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                
                <hr className="my-3" />
                
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Estimated Time */}
              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center text-orange-700">
                  <Clock size={16} className="mr-2" />
                  <span className="text-sm font-medium">Estimated Time</span>
                </div>
                <div className="text-sm text-orange-600 mt-1">15-20 minutes</div>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center text-red-700">
                    <AlertCircle size={16} className="mr-2" />
                    <span className="text-sm font-medium">Error</span>
                  </div>
                  <div className="text-sm text-red-600 mt-1">{errors.submit}</div>
                </div>
              )}

              {/* Place Order Button */}
              <button
                onClick={handleProceed}
                disabled={isLoading}
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Place Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;