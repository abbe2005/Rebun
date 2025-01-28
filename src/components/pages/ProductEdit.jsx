import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { auth } from "../../firebase"; // Import auth from Firebase
import "./styles/ProductEdit.css";

const ProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pictures, setPictures] = useState([]);
  const [type, setType] = useState("sell");
  const [category, setCategory] = useState("cars");
  const [condition, setCondition] = useState("new");
  const [price, setPrice] = useState("");
  const [rentPeriod, setRentPeriod] = useState("day");
  const [sellerName, setSellerName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerLocation, setSellerLocation] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      setError("Error fetching product details.");
    } else {
      setName(data.name);
      setDescription(data.description);
      setType(data.type);
      setCategory(data.category);
      setCondition(data.condition);
      setPrice(data.price);
      setRentPeriod(data.rentPeriod || "day");
      setSellerName(data.sellerName);
      setSellerPhone(data.sellerPhone);
      setSellerEmail(data.sellerEmail);
      setSellerLocation(data.sellerLocation);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 4) {
      setError("You can upload a maximum of 4 pictures.");
      return;
    }
    setPictures([...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pictureUrls = [];
      for (const picture of pictures) {
        const { data, error } = await supabase.storage
          .from("product_images")
          .upload(`public/${auth.currentUser.uid}/${picture.name}`, picture); // Use auth.currentUser.uid

        if (error) throw error;

        const publicUrl = supabase.storage
          .from("product_images")
          .getPublicUrl(data.path);

        pictureUrls.push(publicUrl.data.publicUrl);
      }

      const productData = {
        name,
        description,
        pictures: pictureUrls.length > 0 ? pictureUrls : undefined,
        type,
        category,
        condition,
        price,
        rentPeriod: type === "rent" ? rentPeriod : null,
        sellerName,
        sellerPhone,
        sellerEmail,
        sellerLocation,
      };

      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", productId);

      if (error) throw error;

      setMessage("Product updated successfully!");
      setTimeout(() => navigate("/product-dashboard"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="product-edit-container">
      <div className="product-edit-box">
        <h1 className="product-edit-title">Edit Product</h1>
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
        <form className="product-edit-form" onSubmit={handleSubmit}>
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
            onChange={handleFileChange}
            accept="image/*"
          />
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="sell">Sell</option>
            <option value="rent">Rent</option>
            <option value="both">Both</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="cars">Cars</option>
            <option value="houses">Houses</option>
            <option value="electronics">Electronics</option>
            <option value="items">Items</option>
            <option value="beauty">Beauty</option>
            <option value="clothes">Clothes</option>
          </select>
          <select value={condition} onChange={(e) => setCondition(e.target.value)} required>
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
          {type === "rent" && (
            <select value={rentPeriod} onChange={(e) => setRentPeriod(e.target.value)} required>
              <option value="day">DA/Day</option>
              <option value="hour">DA/Hour</option>
            </select>
          )}
          <input
            type="text"
            placeholder="Your Name or Company Name"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={sellerPhone}
            onChange={(e) => setSellerPhone(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={sellerEmail}
            onChange={(e) => setSellerEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Location (optional)"
            value={sellerLocation}
            onChange={(e) => setSellerLocation(e.target.value)}
          />
          <button type="submit" className="product-edit-button">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;