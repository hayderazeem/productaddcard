import { useEffect, useState } from 'react';
import { axiosInstance } from '../APIs/axiosInstace';

function Getproducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState(() => {
    // Initialize cart from localStorage
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    axiosInstance.get('/products')
      .then((res) => {
        const data = res.data;
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  useEffect(() => {
    // Persist cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const uniqueCategories = [...new Set(products.map((p) => p.category.name))];

  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    let sorted = [...filteredProducts];
    if (selectedOption === 'asc') sorted.sort((a, b) => a.price - b.price);
    else if (selectedOption === 'desc') sorted.sort((a, b) => b.price - a.price);

    setFilteredProducts(sorted);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterProducts(category, searchQuery);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterProducts(selectedCategory, query);
  };

  const filterProducts = (category, query) => {
    let filtered = products;

    if (category) {
      filtered = filtered.filter((p) => p.category.name === category);
    }

    if (query) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (sortOption === 'asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortOption === 'desc') filtered.sort((a, b) => b.price - a.price);

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const getTotalPrice = (item) => (item.price * item.quantity).toFixed(2);

  return (
    <>
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-grow">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 border rounded-md w-full md:w-64"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select
            className="px-4 py-2 capitalize border rounded-md w-full md:w-48"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-auto">
          <select
            className="px-4 py-2 border rounded-md w-full md:w-48"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="default">Sort</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white p-4 border rounded shadow">
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-40 w-full object-contain mb-2"
            />
            <h5 className="text-lg font-bold">{product.title}</h5>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="mt-2 font-bold text-blue-600">${product.price}</p>
            <button
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <div className="mt-10 px-4">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="bg-gray-100 p-4 rounded shadow">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b">
                <span>{item.title}</span>
                <span>Qty: {item.quantity}</span>
                <span>Total: ${getTotalPrice(item)}</span>
              </div>
            ))}
            <div className="mt-4 font-bold text-right">
              Grand Total: $
              {cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Getproducts;
