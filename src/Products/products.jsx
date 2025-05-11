import { useEffect, useState } from 'react';
import { axiosInstance } from '../APIs/axiosInstace';

function Getproducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  const uniqueCategories = [
    ...new Map(products.map((p) => [p.category.id, p.category])).values(),
  ];

  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    let sorted = [...filteredProducts];

    if (selectedOption === 'asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (selectedOption === 'desc') {
      sorted.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(sorted);
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    filterProducts(categoryId, searchQuery);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterProducts(selectedCategory, query);
  };

  const filterProducts = (categoryId, query) => {
    let filtered = products;

    if (categoryId) {
      filtered = filtered.filter((p) => p.category.id === Number(categoryId));
    }

    if (query) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (sortOption === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
    // You can integrate with context or global state here
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-grow">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <select
            className="px-4 py-2 capitalize border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-48"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-auto">
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-48"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="default">Sort</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4">
        {filteredProducts.map((product) => (
          <div key={product.id}>
            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between h-full">
              <a href="#">
                <img
                  className="p-2 rounded-t-lg h-60 w-full object-contain"
                  src={product.images[0]}
                  alt={product.title}
                />
              </a>
              <div className="px-4 py-2 flex-grow">
                <a href="#">
                  <h5 className="mb-1 text-lg font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1">
                    {product.title}
                  </h5>
                </a>
                <p className="mb-2 text-[14px] font-semibold tracking-tight text-gray-900 dark:text-white">
                  Brand: <span className="font-normal">{product.category.name}</span>
                </p>
                <p className="mb-3 text-sm text-gray-700 dark:text-gray-400 line-clamp-3">
                  {product.description}
                </p>
                <h5 className="text-[16px] font-bold text-gray-900 dark:text-white">
                  Price:
                  <span className="ml-1 text-[16px] font-normal">${product.price}</span>
                </h5>
              </div>
              <div className="px-4 pb-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Getproducts;
