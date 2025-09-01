// src/components/CartButton.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";

const CartButton = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  
  const existingOrderId = localStorage.getItem("currentOrderId");
  
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (totalQuantity === 0) return null; // Hide if cart is empty

  return (
    <>
      {/* Desktop/Tablet Cart Button */}
      <div
        onClick={() => navigate("/checkout", { state: { orderId: existingOrderId } })}
        className="hidden sm:flex fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-full font-bold text-base cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out active:scale-95 z-50 items-center space-x-3 group"
        role="button"
        tabIndex={0}
        aria-label={`View cart with ${totalQuantity} items totaling ₹${totalPrice}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate("/checkout", { state: { orderId: existingOrderId } });
          }
        }}
      >
        {/* Cart Icon with Animation */}
        <div className="relative">
          <ShoppingCart size={24} className="group-hover:animate-bounce" />
          {/* Quantity Badge */}
          <div className="absolute -top-2 -right-2 bg-white text-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
            {totalQuantity > 99 ? '99+' : totalQuantity}
          </div>
        </div>
        
        {/* Text Content */}
        <div className="flex flex-col items-start">
          <span className="text-sm opacity-90">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
          </span>
          <span className="text-lg font-bold">₹{totalPrice}</span>
        </div>
        
        {/* Arrow Icon */}
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
        
        {/* Ripple Effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 group-active:animate-ping"></div>
      </div>

      {/* Mobile Cart Button */}
      <div
        onClick={() => navigate("/checkout", { state: { orderId: existingOrderId } })}
        className="sm:hidden fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-4 py-3 rounded-full font-bold text-sm cursor-pointer shadow-lg active:shadow-md transition-all duration-200 ease-in-out active:scale-95 z-50 flex items-center space-x-2 group max-w-xs"
        role="button"
        tabIndex={0}
        aria-label={`View cart with ${totalQuantity} items totaling ₹${totalPrice}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate("/checkout", { state: { orderId: existingOrderId } });
          }
        }}
      >
        {/* Cart Icon with Quantity Badge */}
        <div className="relative flex-shrink-0">
          <ShoppingCart size={20} />
          <div className="absolute -top-1 -right-1 bg-white text-orange-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {totalQuantity > 9 ? '9+' : totalQuantity}
          </div>
        </div>
        
        {/* Mobile Text */}
        <span className="whitespace-nowrap truncate flex-1 min-w-0">
          {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
        </span>
        
        {/* Price */}
        <div className="bg-white bg-opacity-25 px-2 py-1 rounded-full text-xs font-bold flex-shrink-0">
          ₹{totalPrice > 999 ? `${Math.round(totalPrice/1000)}k` : totalPrice}
        </div>
        
        {/* Mobile Ripple Effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 group-active:animate-ping pointer-events-none"></div>
      </div>

      {/* Floating Animation CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(-50%); }
          50% { transform: translateY(-3px) translateX(-50%); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 4px 10px rgba(255, 87, 34, 0.3); }
          50% { box-shadow: 0 8px 20px rgba(255, 87, 34, 0.5); }
        }
        
        .cart-button-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Add floating effect to buttons */
        .sm\\:flex:hover {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Ensure proper z-index stacking */
        @media (max-width: 640px) {
          .bottom-20 {
            bottom: 5.5rem; /* Adjusted for bottom navigation */
          }
        }
        
        /* Improve touch targets */
        @media (max-width: 640px) {
          .cursor-pointer {
            min-height: 44px; /* iOS recommended touch target */
            min-width: 44px;
          }
        }
      `}</style>
    </>
  );
};

export default CartButton;