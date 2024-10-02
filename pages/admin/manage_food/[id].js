import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2'; // Import SweetAlert
import 'bootstrap/dist/css/bootstrap.min.css';

const ManageFood = () => {
  const router = useRouter();
  const { id } = router.query; // Get the food ID from the router query
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
    image_url: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchFoodData();
      fetchCategories();
    }
  }, [id]);

  const fetchFoodData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/menu/${id}`);
      if (!response.ok) throw new Error('Error fetching food data');
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (!response.ok) throw new Error('Error fetching categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Error updating food item');

      // Show success alert using SweetAlert
      await Swal.fire({
        title: 'สำเร็จ!',
        text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonText: 'ตกลง'
      });

      router.push('/admin/all_food'); // Redirect to admin dashboard
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">จัดการรายการอาหาร</h1>
      {loading ? (
        <p>กำลังโหลด...</p>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <img
              src={formData.image_url || 'default_image_url.jpg'} // Replace with a default image URL if needed
              alt={formData.name}
              className="img-fluid" // Responsive image class
            />
          </div>
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">ชื่ออาหาร:</label>
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
                <button type="submit" className="btn btn-success">บันทึก</button>
                <button type="button" className="btn btn-secondary" onClick={() => router.push('/admin/manage_food')}>ย้อนกลับ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFood;
