import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./styles/Market.css";

const Market = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    condition: "",
    priceMin: "",
    priceMax: "",
  });
  const [sortBy, setSortBy] = useState("date");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, category, filters, sortBy]);

  const fetchProducts = async () => {
    try {
      let q = query(collection(db, "products"));

      if (searchTerm) {
        q = query(q, where("name", ">=", searchTerm), where("name", "<=", searchTerm + "\uf8ff"));
      }

      if (category) {
        q = query(q, where("category", "==", category));
      }

      if (filters.type) {
        q = query(q, where("type", "==", filters.type));
      }

      if (filters.condition) {
        q = query(q, where("condition", "==", filters.condition));
      }

      if (filters.priceMin) {
        q = query(q, where("price", ">=", filters.priceMin));
      }

      if (filters.priceMax) {
        q = query(q, where("price", "<=", filters.priceMax));
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Group products by category
  const groupProductsByCategory = () => {
    const grouped = {};
    products.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  };

  const groupedProducts = groupProductsByCategory();

  return (
    <div className="market-container">
      <div className="market-box">
        <h1 className="market-title">Market</h1>
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search for an item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="cars">Cars</option>
            <option value="houses">Houses</option>
            <option value="electronics">Electronics</option>
            <option value="items">Items</option>
            <option value="beauty">Beauty</option>
            <option value="clothes">Clothes</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="sell">Sell</option>
            <option value="rent">Rent</option>
            <option value="both">Both</option>
          </select>
          <select
            value={filters.condition}
            onChange={(e) =>
              setFilters({ ...filters, condition: e.target.value })
            }
          >
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={filters.priceMin}
            onChange={(e) =>
              setFilters({ ...filters, priceMin: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.priceMax}
            onChange={(e) =>
              setFilters({ ...filters, priceMax: e.target.value })
            }
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Newest First</option>
            <option value="price">Price Low to High</option>
          </select>
        </div>

        {/* Render sections by category */}
        {Object.keys(groupedProducts).length > 0 ? (
          Object.keys(groupedProducts).map((category) => (
            <div key={category} className="category-section">
              <h2 className="category-title">{category}</h2>
              <div className="product-grid">
                {groupedProducts[category].map((product) => (
                  <div
                    key={product.id}
                    className="card"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img src={product.pictures[0]} alt={product.name} />
                    <div className="card__content">
                      <p className="card__title">{product.name}</p>
                      <p className="card__description">
                        {product.type}<br></br>
                        {product.price} {product.priceType}
                        <br></br>
                        {product.condition}
                        <br></br>
                        {product.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Market;