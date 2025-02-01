import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import supabase from "../../supabase";
import { useNavigate } from "react-router-dom";
import "./styles/AddProduct.css";
import "./Theme.css";



const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pictures, setPictures] = useState([]);
  const [type, setType] = useState("sell");
  const [category, setCategory] = useState("cars");
  const [condition, setCondition] = useState("new");
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("DA");
  const [sellerName, setSellerName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerLocation, setSellerLocation] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const sanitizeFileName = (fileName) => {
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .substring(0, 100);
  };

  const handlePictureChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setPictures(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError("You must be logged in to add a product.");
      return;
    }

    setIsLoading(true); // Start loading
    try {
      const pictureUrls = [];
      for (const picture of pictures) {
        const sanitizedFileName = sanitizeFileName(picture.name);
        const { data, error } = await supabase.storage
          .from("product_images")
          .upload(`public/${auth.currentUser.uid}/${sanitizedFileName}`, picture);

        if (error) throw error;

        const publicUrl = supabase.storage
          .from("product_images")
          .getPublicUrl(data.path);
        pictureUrls.push(publicUrl.data.publicUrl);
      }

      const productData = {
        userId: auth.currentUser.uid,
        name,
        description,
        pictures: pictureUrls,
        type,
        category,
        condition,
        price,
        priceType,
        sellerName,
        sellerPhone,
        sellerEmail,
        sellerLocation,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "products"), productData);

      setMessage("Product added successfully!");
      setTimeout(() => navigate("/market"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-box">
        <h1 className="add-product-title">Add Product</h1>
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
        <form className="add-product-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="file"
            multiple
            onChange={handlePictureChange}
            accept="image/*"
            required
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="sell">Sell</option>
            <option value="rent">Rent</option>
            <option value="both">Both</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="cars">Cars</option>
            <option value="houses">Houses</option>
            <option value="electronics">Electronics</option>
            <option value="items">Items</option>
            <option value="beauty">Beauty</option>
            <option value="clothes">Clothes</option>
          </select>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <select
            value={priceType}
            onChange={(e) => setPriceType(e.target.value)}
          >
            <option value="DA">DA</option>
            <option value="DA/Day">DA/Day</option>
            <option value="DA/Hour">DA/Hour</option>
          </select>
          <input
            type="text"
            placeholder="Seller Name"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Seller Phone"
            value={sellerPhone}
            onChange={(e) => setSellerPhone(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Seller Email"
            value={sellerEmail}
            onChange={(e) => setSellerEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Seller Location"
            value={sellerLocation}
            onChange={(e) => setSellerLocation(e.target.value)}
          />
          <button
            type="submit"
            className="add-product-button"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;