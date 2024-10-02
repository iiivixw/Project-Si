import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";

const AddFood = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category_id: "",
    image_url: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      if (!response.ok) throw new Error("Error fetching categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Error adding food item");
      router.push("/admin/all_food");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mt-5" style={{ backgroundColor: "#C8E6B2" }}>
      <h1 className="text-center mb-4">เพิ่มเมนูอาหารใหม่</h1>
      {error && <p className="text-danger text-center">{error}</p>}
      <div className="row">
        <div className="col-md-6">
          <img
            src={formData.image_url || "placeholder-image-url"}
            alt={formData.name}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">ชื่อเมนูอาหาร:</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">ราคา:</label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">หมวดหมู่:</label>
              <select
                name="category_id"
                className="form-select"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">เลือกหมวดหมู่</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">URL ของภาพ:</label>
              <input
                type="text"
                name="image_url"
                className="form-control"
                value={formData.image_url}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-success">
                บันทึก
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => router.push("/admin/all_food")}
              >
                ย้อนกลับ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFood;
