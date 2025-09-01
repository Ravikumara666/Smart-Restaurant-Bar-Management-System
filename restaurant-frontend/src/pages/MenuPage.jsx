import React, { useEffect, useState } from "react";
import { Menu, X, Home, ShoppingCart, User, LogIn } from 'lucide-react';
import MenuItemCard from "../components/MenuItemCard";
import { getCatogeries, getMenuItems } from "../utils/menuApi";
import CartButton from "../components/CartButton";
import { useNavigate } from "react-router-dom";


const MenuPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
const navigate=useNavigate()
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        console.log("start")
        const data = await getMenuItems();
        console.log(data)
        setMenu(data);
        console.log("seted data in menu")

        const categoriesAPI= await getCatogeries()
        console.log(categories)
        setCategories(categoriesAPI);
        console.log("set the category")
        // console.log(uniqueCategories)
        
        // Set first category as default if no category is selected
        // if (uniqueCategories.length > 0 && !selectedCategory) {
        //   setSelectedCategory(uniqueCategories[0]);
        // }
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredMenu = selectedCategory
    ? menu.filter(item => item.category === selectedCategory)
    : menu;

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
 <div className="bg-orange-500 text-white sticky top-0 z-40 shadow-md">
      <div className="flex items-center justify-between p-4">
        {/* Left Section */}
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden mr-3 p-1 hover:bg-orange-600 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold">Smart Dining</h1>
        </div>

        {/* Right Section - Login Button */}
        <div>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 bg-white text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-100 transition"
          >
            <LogIn size={18} />
            <span className="font-semibold">Login</span>
          </button>
        </div>
      </div>
    </div>

      <div className="flex relative">
        {/* Sidebar */}
        <div className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30 lg:z-0`}>
          
          {/* Mobile Sidebar Header */}
          <div className="lg:hidden bg-orange-500 text-white p-4 flex items-center justify-between">
            <h2 className="font-bold text-lg">Categories</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 hover:bg-orange-600 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Categories List */}
          <div className="p-4 h-full overflow-y-auto">
            <div className="space-y-2">
              {/* All Items Option */}
              <button
                onClick={() => handleCategorySelect("")}
                className={`w-full text-left p-3 rounded-lg font-medium transition-all duration-200 hover:shadow-sm ${
                  selectedCategory === ""
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                All Items
              </button>

              {/* Category Buttons */}
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-left p-3 rounded-lg font-medium transition-all duration-200 hover:shadow-sm ${
                    selectedCategory === category
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-4 lg:p-6">
            {/* Category Header */}
            <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {selectedCategory || "All Items"}
              </h2>
              <p className="text-gray-600">
                {filteredMenu.length} {filteredMenu.length === 1 ? 'item' : 'items'} available
              </p>
            </div>

            {/* Menu Items Grid */}
            {filteredMenu.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <ShoppingCart size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
                <p className="text-gray-500">Try selecting a different category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 pb-24">
                {filteredMenu.map((item) => (
                  <div
                    key={item._id}
                    className="transform transition-transform duration-200 hover:scale-105"
                  >
                    <MenuItemCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Button */}
      <CartButton />

      {/* Bottom Navigation for Mobile */}

      {/* Category Pills for Mobile (Alternative Navigation) */}
      <div className="lg:hidden fixed top-16 left-0 right-0 bg-white shadow-sm border-b z-30">
        <div className="flex overflow-x-auto p-2 space-x-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("")}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === ""
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Add top margin to content when pills are visible */}
      <style>{`
        @media (max-width: 1024px) {
          .flex-1 > div {
            padding-top: 4rem !important;
          }
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MenuPage;