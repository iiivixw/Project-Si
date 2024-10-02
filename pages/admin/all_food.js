import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter
import Swal from "sweetalert2";

export default function AllFood() {
  const [foodData, setFoodData] = useState([]);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    fetchFoodData();
  }, []);

  const fetchFoodData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/menu");
      const data = await response.json();
      setFoodData(data);
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
  };

  const handleDeleteFood = async (foodId) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณจะไม่สามารถกู้คืนอาหารนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await fetch(`http://localhost:5000/api/menu/${foodId}`, {
          method: "DELETE",
        });
        fetchFoodData();
        Swal.fire("Deleted!", "อาหารของคุณถูกลบแล้ว.", "success");
      } catch (error) {
        console.error("Error deleting food item:", error);
        Swal.fire("Oops...", "เกิดข้อผิดพลาดในการลบอาหาร.", "error");
      }
    }
  };

  const handleEditFood = (foodId) => {
    router.push(`/admin/manage_food/${foodId}`); // Redirect to edit page
  };

  const handleAddFood = () => {
    router.push("/admin/add_food"); // Redirect to add food page
  };

  return (
    <div
      className="all-food d-flex flex-column justify-content-center align-items-center"
      style={{
        backgroundColor: "#C8E6B2",
        minHeight: "100vh",
        padding: "20px",
      }} // Ensure full height and padding
    >
      <h2>จัดการข้อมูลเมนูอาหาร</h2>
      <button className="btn btn-success mt-3 p-2" onClick={handleAddFood}>
        เพิ่มเมนูอาหาร
      </button>
      <table className="table text-center mt-4 align-middle">
        <thead>
          <tr>
            <th>รูปภาพ</th>
            <th>ชื่ออาหาร</th>
            <th>ราคา</th>
            <th>จัดการข้อมูล</th>
          </tr>
        </thead>
        <tbody>
          {foodData.map((food) => (
            <tr key={food.id}>
              <td>
                <img src={food.image_url} alt={food.name} width="100" />
              </td>
              <td>{food.name}</td>
              <td>{food.price} บาท</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2" // Added btn-sm for small size
                  onClick={() => handleEditFood(food.id)}
                >
                  แก้ไข
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteFood(food.id)}
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
