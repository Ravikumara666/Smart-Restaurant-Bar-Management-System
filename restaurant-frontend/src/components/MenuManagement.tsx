import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Upload, Utensils } from 'lucide-react';

// --- INTERFACES ---

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  createdAt: string;
}

interface MenuItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
  categories: string[];
  isSaving: boolean;
}

// --- MAIN COMPONENT: MenuManagement ---

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const categories = ['all', 'Hot Drinks', 'Cold Drinks', 'Chicken Dishes', 'Mutton Dishes', 'Veg Dishes', 'Starters', 'Main Course', 'Desserts', 'Beverages'];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/menu`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      } else {
        console.error('Server responded with an error:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMenuItem = async (formData: FormData) => {
    setIsSaving(true);
    const isEditing = !!editingItem;
    const url = isEditing ? `${API_BASE_URL}/api/menu/${editingItem?._id}` : `${API_BASE_URL}/api/menu`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type' is not needed; the browser sets it for FormData
        },
        body: formData,
      });

      if (response.ok) {
        setShowAddModal(false);
        setEditingItem(null);
        fetchMenuItems(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to save item.'}`);
      }
    } catch (error) {
      console.error('Failed to save menu item:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteMenuItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/api/menu/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          fetchMenuItems(); // Refresh the list
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message || 'Failed to delete item.'}`);
        }
      } catch (error) {
        console.error('Failed to delete menu item:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setShowAddModal(false); // Ensure add modal is not simultaneously active
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Menu Management</h2>
            <p className="text-gray-600 mt-1">Manage your restaurant's menu items</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <Plus size={20} className="mr-2" />
            Add Menu Item
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
            </div>
          ))
        ) : filteredItems.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img
                src={item.image || `https://via.placeholder.com/400x300.png?text=${item.name}`}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2 gap-2">
                <h3 className="font-semibold text-gray-900 line-clamp-1 flex-1">{item.name}</h3>
                <span className="text-lg font-bold text-orange-600 flex-shrink-0">₹{item.price.toFixed(2)}</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[40px]">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {item.category}
                </span>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    aria-label={`Edit ${item.name}`}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteMenuItem(item._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-12 col-span-full">
          <div className="text-5xl mb-4 text-gray-400"><Utensils /></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Menu Items Found</h3>
          <p className="text-gray-600">Try adjusting your search, clearing filters, or adding a new item.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <MenuItemModal
          item={editingItem}
          onClose={handleCloseModal}
          onSave={handleSaveMenuItem}
          categories={categories.filter(c => c !== 'all')}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

// --- MODAL COMPONENT: MenuItemModal ---

const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, onClose, onSave, categories, isSaving }) => {
  const isEditing = !!item;
  const initialFormState = {
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    category: item?.category || (categories.length > 0 ? categories[0] : ''),
    available: item?.available ?? true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image || null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', String(formData.price));
    data.append('category', formData.category);
    data.append('available', String(formData.available));
    if (imageFile) {
      data.append('image', imageFile);
    }
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"/>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" id="category" value={formData.category} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-auto rounded-md object-cover" />
                ) : (
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none">
                    <span>{imageFile ? 'Change file' : 'Upload a file'}</span>
                    <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*"/>
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="available" id="available" checked={formData.available} onChange={handleCheckboxChange} className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"/>
            <label htmlFor="available" className="ml-2 block text-sm text-gray-900">Item is available</label>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 flex items-center">
              {isSaving ? 'Saving...' : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuManagement;
















































// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Search, X, Upload } from 'lucide-react';

// interface MenuItem {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   image: string;
//   available: boolean;
//   createdAt: string;
// }

// const MenuManagement: React.FC = () => {
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

//   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

//   const categories = ['all', 'Hot Drinks', 'Cold Drinks', 'Chicken Dishes', 'Mutton Dishes', 'Veg Dishes', 'Starters', 'Main Course', 'Desserts', 'Beverages'];

//   useEffect(() => {
//     fetchMenuItems();
//   }, []);

//   const fetchMenuItems = async () => {
//     try {
//       const token = localStorage.getItem('adminToken');
//       const response = await fetch(`${API_BASE_URL}/api/menu`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setMenuItems(data);
//       }
//     } catch (error) {
//       console.error('Failed to fetch menu items:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredItems = menuItems.filter(item => {
//     const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const deleteMenuItem = async (id: string) => {
//     if (window.confirm('Are you sure you want to delete this item?')) {
//       try {
//         const token = localStorage.getItem('adminToken');
//         const response = await fetch(`${API_BASE_URL}/api/menu/${id}`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           }
//         });

//         if (response.ok) {
//           fetchMenuItems();
//         }
//       } catch (error) {
//         console.error('Failed to delete menu item:', error);
//       }
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header and Controls */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900">Menu Management</h2>
//             <p className="text-gray-600 mt-1">Manage your restaurant's menu items</p>
//           </div>
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//           >
//             <Plus size={20} className="mr-2" />
//             Add Menu Item
//           </button>
//         </div>

//         {/* Search and Filter */}
//         <div className="flex flex-col md:flex-row gap-4 mt-6">
//           <div className="flex-1 relative">
//             <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search menu items..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//             />
//           </div>
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//           >
//             {categories.map(category => (
//               <option key={category} value={category}>
//                 {category === 'all' ? 'All Categories' : category}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Menu Items Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {loading ? (
//           [...Array(6)].map((_, i) => (
//             <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
//               <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
//               <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//               <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//             </div>
//           ))
//         ) : filteredItems.map((item) => (
//           <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
//             <div className="relative">
//               <img
//                 src={item.image || '/api/placeholder/300/200'}
//                 alt={item.name}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="absolute top-2 right-2">
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                   item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                 }`}>
//                   {item.available ? 'Available' : 'Unavailable'}
//                 </span>
//               </div>
//             </div>
            
//             <div className="p-4">
//               <div className="flex items-start justify-between mb-2">
//                 <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
//                 <span className="text-lg font-bold text-orange-600">${item.price.toFixed(2)}</span>
//               </div>
              
//               <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
              
//               <div className="flex items-center justify-between">
//                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                   {item.category}
//                 </span>
                
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={() => setEditingItem(item)}
//                     className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
//                   >
//                     <Edit size={16} />
//                   </button>
//                   <button
//                     onClick={() => deleteMenuItem(item._id)}
//                     className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredItems.length === 0 && !loading && (
//         <div className="text-center py-12">
//           <div className="text-4xl mb-4">🍽️</div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
//           <p className="text-gray-600">Try adjusting your search or filters</p>
//         </div>
//       )}
//       {/* Add/Edit Menu Item Modal */}
//       {editingItem && (
//         <MenuItemModal
//           item={editingItem}
//           onClose={() => setEditingItem(null)}
//           onSave={fetchMenuItems}
//         />
//       )}