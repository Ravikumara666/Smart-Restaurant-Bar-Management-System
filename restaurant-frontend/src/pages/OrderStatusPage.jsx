import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  ChefHat, 
  Truck, 
  CreditCard, 
  Banknote, 
  MapPin, 
  User, 
  Phone, 
  MessageCircle, 
  RefreshCw, 
  AlertCircle,
  Receipt,
  Calendar,
  Timer,
  ShoppingBag
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const OrderStatusPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  // Status configuration
  const statusConfig = {
    pending: { 
      icon: Clock, 
      color: 'text-yellow-600 bg-yellow-100', 
      message: 'Order received and being processed',
      progress: 0
    },
    confirmed: { 
      icon: CheckCircle, 
      color: 'text-blue-600 bg-blue-100', 
      message: 'Order confirmed by restaurant',
      progress: 25
    },
    preparing: { 
      icon: ChefHat, 
      color: 'text-orange-600 bg-orange-100', 
      message: 'Your delicious meal is being prepared',
      progress: 45
    },
    ready: { 
      icon: CheckCircle, 
      color: 'text-green-600 bg-green-100', 
      message: 'Order ready for pickup/delivery',
      progress: 80
    },
    served : { 
      icon: CheckCircle, 
      color: 'text-green-600 bg-green-100', 
      message: 'Order completed successfully',
      progress: 90
    },
    completed : { 
      icon: CheckCircle, 
      color: 'text-green-600 bg-green-100', 
      message: 'Order completed successfully',
      progress: 100
    },
    cancelled: { 
      icon: AlertCircle, 
      color: 'text-red-600 bg-red-100', 
      message: 'Order has been cancelled',
      progress: 0
    }
  };

  // Fetch order data
  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/orders/${id}`);
      console.log(res)
      setOrder(res.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load order");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [id]);

  // Handle payment method selection
  const handlePaymentMethod = async (method) => {
    setPaymentProcessing(true);
    try {
      await axios.patch(`${API_BASE_URL}/orders/${id}`, {
        paymentMethod: method
      });
      
      setOrder(prev => ({ ...prev, paymentMethod: method }));
      
      if (method === 'cash') {
        alert("Cash payment selected! Please pay in counter.");
      } else {
        alert("Online payment selected! Redirecting to payment gateway...");
        // Here you would integrate with payment gateway
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update payment method");
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Loading state
  if (loading && !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Order Status</h1>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <AlertCircle size={64} className="text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchOrder}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log("order")
  console.log(order)
  const currentStatus = statusConfig[order.status] || statusConfig.pending;
  // console.log(currentStatus)
  const StatusIcon = currentStatus.icon;
  // console.log(StatusIcon)

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
            <div>
              <h1 className="text-xl font-bold text-gray-900">Order Status</h1>
              <p className="text-sm text-gray-600">Order #{order._id.slice(-8)}</p>
            </div>
          </div>
          
          <button
            onClick={fetchOrder}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${currentStatus.color}`}>
                <StatusIcon size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 capitalize">{order.status}</h2>
                <p className="text-gray-600">{currentStatus.message}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-500">₹{order.totalPrice}</div>
              <div className="text-sm text-gray-500">Total Amount</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Order Placed</span>
              <span>{currentStatus.progress}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${currentStatus.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {Object.entries(statusConfig).filter(([key]) => key !== 'cancelled').map(([key, config], index) => {
              const isActive = order.status === key;
              const isPast = currentStatus.progress > config.progress;
              const Icon = config.icon;
              
              return (
                <div key={key} className="text-center">
                  <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isActive || isPast ? config.color : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className={`text-xs font-medium capitalize ${
                    isActive || isPast ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {key}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ShoppingBag size={20} className="mr-2" />
                Order Items
              </h3>
              
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.menuItemId?.name || "Menu Item"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ₹{(item.menuItemId?.price || 0) * item.quantity}
                      </div>
                      <div className="text-sm text-gray-500">
                        ₹{item.menuItemId?.price || 0} each
                      </div>
                    </div>
                  </div>
                ))}
                {/* Render additionalItems if present */}
                {order.additionalItems && order.additionalItems.length > 0 && (
                  order.additionalItems.map((item, idx) => (
                    <div key={`add-${idx}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.menuItemId?.name || "Menu Item"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          ₹{(item.menuItemId?.price || 0) * item.quantity}
                        </div>
                        <div className="text-sm text-gray-500">
                          ₹{item.menuItemId?.price || 0} each
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Add More Items Button */}
            {order.status && order.status.toLowerCase() !== "completed" && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add More Items</h3>
                <button
                  onClick={() => navigate("/", { state: { orderId: order._id } })}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Add More Items
                </button>
              </div>
            )}
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User size={20} className="mr-2" />
                Order Information
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin size={16} className="text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Table Number</div>
                    <div className="font-medium">{order.tableNumber}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User size={16} className="text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Customer</div>
                    <div className="font-medium">{order.placedBy || "Guest"}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Order Date</div>
                    <div className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Timer size={16} className="text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Order Time</div>
                    <div className="font-medium">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <MessageCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-blue-900">Special Instructions</div>
                      <div className="text-sm text-blue-700">{order.notes}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Payment & Actions */}
          <div className="space-y-6">
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard size={20} className="mr-2" />
                Payment Method
              </h3>

              {order.paymentMethod ? (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 text-green-700">
                    {order.paymentMethod === 'cash' ? <Banknote size={20} /> : <CreditCard size={20} />}
                    <span className="font-medium capitalize">{order.paymentMethod} Payment</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    {order.paymentMethod === 'cash' 
                      ? 'Please pay in counter' 
                      : 'Payment will be processed shortly'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Please select your preferred payment method:
                  </p>
                  
                  <button
                    onClick={() => handlePaymentMethod('cash')}
                    disabled={paymentProcessing}
                    className="w-full p-4 border-2 border-gray-200 hover:border-orange-500 rounded-lg transition-colors text-left flex items-center space-x-3 group"
                  >
                    <Banknote size={20} className="text-gray-500 group-hover:text-orange-500" />
                    <div>
                      <div className="font-semibold">Cash Payment</div>
                      <div className="text-sm text-gray-600">Pay at the table</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handlePaymentMethod('online')}
                    disabled={paymentProcessing}
                    className="w-full p-4 border-2 border-gray-200 hover:border-orange-500 rounded-lg transition-colors text-left flex items-center space-x-3 group"
                  >
                    <CreditCard size={20} className="text-gray-500 group-hover:text-orange-500" />
                    <div>
                      <div className="font-semibold">Online Payment</div>
                      <div className="text-sm text-gray-600">Pay with card/UPI</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Receipt size={20} className="mr-2" />
                Order Summary
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹{order.totalPrice}</span>
                </div>
              </div>

              {/* Estimated Time - show only if order.status is NOT "completed" */}
              {order.status.toLowerCase() !== "completed" && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center text-orange-700">
                    <Clock size={16} className="mr-2" />
                    <span className="text-sm font-medium">
                      {order.status === 'delivered' ? 'Order Completed' : 'Estimated Time'}
                    </span>
                  </div>
                  <div className="text-sm text-orange-600 mt-1">
                    {order.status === 'delivered' ? 'Thank you for your order!' : '15-20 minutes'}
                  </div>
                </div>
              )}

              {/* Completed Order Payment/Paid Block */}
              {order.status.toLowerCase() === "completed" && order.paymentStatus !== "Paid" ? (
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center mt-4">
                  <div className="text-lg font-semibold text-gray-900 mb-4">
                    Order Completed! Payment Pending
                  </div>
                  <button
                    onClick={() => navigate(`/payment/${order._id}`)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    View &amp; Pay Bill
                  </button>
                </div>
              ) : order.status.toLowerCase() === "completed" && order.paymentStatus === "Paid" ? (
                <div className="p-6 bg-green-100 border border-green-300 rounded-xl text-center mt-4 shadow-md">
                  <div className="text-3xl font-bold text-green-800 mb-2">Payment Successful</div>
                  <p className="text-green-700 text-sm md:text-base">
                    Thank you! Your payment has been received and confirmed.
                  </p>
                </div>
              ) : null}
            </div> 

            {/* Help Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3">
                  <Phone size={16} className="text-gray-500" />
                  <span>Call Restaurant</span>
                </button>
                <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3">
                  <MessageCircle size={16} className="text-gray-500" />
                  <span>Chat Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;