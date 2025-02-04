import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/ProductDetails.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [likes, setLikes] = useState(0);
  const [likedBy, setLikedBy] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const productData = docSnap.data();
        setProduct(productData);
        setLikes(productData.likes || 0);
        setLikedBy(productData.likedBy || []);
      } else {
        setError("Product not found.");
      }
    } catch (err) {
      setError("Error fetching product details.");
      console.error("Error fetching product:", err);
    }
  };

  const handleLike = async () => {
    if (!user) {
      setError("You must be logged in to like a product.");
      return;
    }

    if (likedBy.includes(user.uid)) {
      setMessage("You've already liked this product.");
      return;
    }

    try {
      const docRef = doc(db, "products", productId);
      await updateDoc(docRef, {
        likes: likes + 1,
        likedBy: arrayUnion(user.uid),
      });

      setLikes(likes + 1);
      setLikedBy([...likedBy, user.uid]);
      setMessage("Product liked successfully!");
    } catch (err) {
      setError("Error updating likes.");
      console.error("Error updating likes:", err);
    }
  };

  const handleImageChange = (index) => {
    setCurrentImage(index);
  };

  const handleMessageSeller = async () => {
    if (!user) {
      setError("You must be logged in to message the seller.");
      return;
    }
  
    if (!product.userId) {
      setError("Seller information is missing. Cannot start a chat.");
      return;
    }
  
    try {
      const chatId = `${user.uid}_${product.userId}`; // Use userId instead of sellerId
      const chatRef = doc(db, "chats", chatId);
  
      // Check if chat already exists
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        // Create a new chat
        await setDoc(chatRef, {
          participants: [user.uid, product.userId], // Use userId
          messages: [],
          createdAt: new Date(),
        });
      }
  
      // Redirect to messages page
      navigate(`/messages?chatId=${chatId}`);
    } catch (err) {
      setError("Error starting chat with seller.");
      console.error("Error starting chat:", err);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details-container">
      <div className="product-details-box">
        <h1 className="product-details-title">{product.name}</h1>
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
        <div className="product-images">
          <img src={product.pictures[currentImage]} alt={product.name} />
          <div className="image-thumbnails">
            {product.pictures.map((picture, index) => (
              <img
                key={index}
                src={picture}
                alt={`Product ${index + 1}`}
                onClick={() => handleImageChange(index)}
                className={currentImage === index ? "active" : ""}
              />
            ))}
          </div>
        </div>
        <div className="product-info">
          <p>{product.description}</p>
          <p>This product is for: {product.type}</p>
          <p>Price: {product.price} {product.priceType}</p>
          <p>Category: {product.category}</p>
          <p>Condition: {product.condition}</p>
          <p>Seller: {product.sellerName}</p>
          <p>Contact: {product.sellerPhone}</p>
          <p>Email: {product.sellerEmail}</p>
          <p>Location: {product.sellerLocation}</p>
        </div>
        <button onClick={handleLike} className="like-button">
          Like ({likes})
        </button>
        <button onClick={handleMessageSeller} className="message-button">
          Message Seller
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;