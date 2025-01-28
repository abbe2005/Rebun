import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase"; // Import Firebase Auth and Firestore
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"; // Import Firestore modular methods
import { useNavigate } from "react-router-dom";
import "./styles/ProductDashboard.css";

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (!auth.currentUser) {
      setError("You must be logged in to view your products.");
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, "products"), where("userId", "==", auth.currentUser.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    } catch (err) {
      setError("Error fetching products. Please try again later.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      fetchProducts();
    } catch (err) {
      setError("Error deleting product. Please try again.");
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="product-dashboard-container">
      <div className="product-dashboard-box">
        <h1 className="product-dashboard-title">My Products</h1>
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>You have no products. <a href="/add-product">Start by adding one!</a></p>
        ) : (
          <div className="product-list">
            {products.map((product) => (
              <div key={product.id} className="product-item">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Price: {product.price} {product.priceType}</p>
                <p>Visitors: {product.visitors || 0}</p>
                <p>Likes: {product.likes || 0}</p>
                <button onClick={() => handleEdit(product.id)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDashboard;