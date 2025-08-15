// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addToCart } from "../features/cart/cartSlice";

// const MenuItemCard = ({ item }) => {
//   const dispatch = useDispatch();
//   const quantity=useSelector((state)=>state.cart.quantity);
  

//   return (
//     <div className="menu-card">
//       <img src={item.image} alt={item.name} width="100" />
//       <h3>{item.name}</h3>
//       <p>{item.description}</p>
//       <strong>₹{item.price}</strong>
//       <button onClick={() => dispatch(addToCart(item))}>Add to Cart</button>
//     </div>

//   );
// };

// export default MenuItemCard;


import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Minus, ShoppingCart, Heart, Star } from "lucide-react";
import { addToCart, removeFromCart, updateQuantity } from "../features/cart/cartSlice";

const MenuItemCard = ({ item }) => {
  const dispatch = useDispatch();
  
  // Get the specific item's quantity from cart
  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find(cartItem => cartItem._id === item._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    dispatch(addToCart(item));
  };

  const handleRemoveFromCart = () => {
    if (quantity > 0) {
      dispatch(removeFromCart(item._id));
    }
  };

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(item._id));
    } else {
      dispatch(updateQuantity({ id: item._id, quantity: newQuantity }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] group">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-48 sm:h-52 object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Favorite Button */}
        <button 
          className="absolute top-3 right-3 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Add to favorites"
        >
          <Heart size={16} className="text-gray-600 hover:text-red-500 transition-colors" />
        </button>

        {/* Discount Badge (if applicable) */}
        {item.discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {item.discount}% OFF
          </div>
        )}

        {/* Rating Badge (if applicable) */}
        {item.rating && (
          <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 flex items-center px-2 py-1 rounded-full shadow-sm">
            <Star size={12} className="text-yellow-400 fill-current" />
            <span className="text-xs font-medium ml-1">{item.rating}</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 flex-1 pr-2">
            {item.name}
          </h3>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold text-orange-500">₹{item.price}</span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-sm text-gray-400 line-through">₹{item.originalPrice}</span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Additional Info */}
        <div className="flex items-center justify-between mb-4">
          {/* Veg/Non-Veg Indicator */}
          {item.isVeg !== undefined && (
            <div className="flex items-center">
              <div className={`w-3 h-3 border-2 ${item.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center`}>
                <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <span className="text-xs text-gray-500 ml-1">
                {item.isVeg ? 'Veg' : 'Non-Veg'}
              </span>
            </div>
          )}

          {/* Spice Level */}
          {item.spiceLevel && (
            <div className="flex items-center">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full mr-1 ${
                    i < item.spiceLevel ? 'bg-red-500' : 'bg-gray-200'
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">Spicy</span>
            </div>
          )}
        </div>

        {/* Add to Cart Section */}
        {quantity === 0 ? (
          /* Add to Cart Button */
          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95 group/btn"
          >
            <ShoppingCart size={18} className="group-hover/btn:animate-bounce" />
            <span>Add to Cart</span>
          </button>
        ) : (
          /* Quantity Controls */
          <div className="flex items-center justify-between bg-orange-500 rounded-lg p-3 shadow-sm">
            <button
              onClick={handleRemoveFromCart}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 active:bg-opacity-40 text-white rounded-full p-2 transition-all duration-200 active:scale-90 hover:scale-110"
              aria-label="Decrease quantity"
            >
              <Minus size={16} className="text-gray-800"/>
            </button>
            
            <div className="flex flex-col items-center">
              <span className="text-white font-bold text-lg px-4">{quantity}</span>
              <span className="text-white text-xs opacity-80">in cart</span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 active:bg-opacity-40 text-white rounded-full p-2 transition-all duration-200 active:scale-90 hover:scale-110"
              aria-label="Increase quantity"
            >
              <Plus size={16} className="text-gray-800" />
            </button>
          </div>
        )}

        {/* Quick Actions (Optional) */}
        {quantity > 0 && (
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Subtotal: <span className="font-semibold text-gray-700">₹{item.price * quantity}</span>
            </span>
            <button
              onClick={() => handleUpdateQuantity(0)}
              className="text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Loading State Overlay (when updating) */}
      <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center opacity-0 group-disabled:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
      </div>
    </div>
  );
};

export default MenuItemCard;