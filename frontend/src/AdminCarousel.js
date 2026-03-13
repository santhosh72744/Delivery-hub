import React, { useState, useEffect, useCallback } from "react";
import "./AdminCarousel.css"; // Import the CSS file

export default function AdminCarousel() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("adminToken");

  const fetchCarousel = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/carousel", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setItems(data.items);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchCarousel();
  }, [fetchCarousel]);

  const handleUpload = async () => {
    if (!file) return alert("Select an image first");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/admin/carousel", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setFile(null);
        fetchCarousel();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSlide = async (id) => {
    if (!window.confirm("Delete this slide?")) return;
    try {
      await fetch(`/api/admin/carousel/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCarousel();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSlide = async (id) => {
    try {
      await fetch(`/api/admin/carousel/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCarousel();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-header">Carousel Manager</h2>

    <div className="upload-card">

  <div className="dimension-info">
    <strong>Recommended image size:</strong> 1600 × 900 px  
    <br />
    Aspect Ratio: 16 : 9  
    <br />
    Format: JPG / PNG  
    <br />
   
  </div>

  <input type="file" onChange={(e) => setFile(e.target.files[0])} />

  <button className="btn btn-upload" onClick={handleUpload}>
    Upload Slide
  </button>

</div>
      <div className="carousel-grid">
        {items.length === 0 && <p className="empty-state">No carousel slides yet.</p>}

        {items.map((item) => (
          <div key={item.id} className="carousel-item">
            <img
              className="carousel-image"
              src={`https://www.deliveryhubca.com/${item.image_url}`}
              alt="carousel"
            />
            <div className="item-details">
              <button 
                className={`btn btn-toggle ${item.is_active ? "active" : ""}`} 
                onClick={() => toggleSlide(item.id)}
              >
                {item.is_active ? "Active" : "Disabled"}
              </button>
              <button className="btn btn-delete" onClick={() => deleteSlide(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}