import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2"; // นำเข้า SweetAlert

const AddTable = () => {
  const [tableNumber, setTableNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Set full background color for the page
    document.body.style.backgroundColor = "#C8E6B2"; // Set background to light green
    return () => {
      // Clean up background color when component unmounts
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Resetting error state on submit

    // Validate input
    if (!tableNumber.trim()) {
      setError("หมายเลขโต๊ะต้องไม่เป็นค่าว่าง");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ table_number: tableNumber }), // ส่งเฉพาะ table_number
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
        );
      }

      Swal.fire("สำเร็จ!", "โต๊ะใหม่ได้ถูกเพิ่มเรียบร้อยแล้ว.", "success").then(
        () => {
          router.push("/admin/all_table"); // กลับไปที่หน้า Manage Table
        }
      );
    } catch (error) {
      setError(error.message);
      Swal.fire("เกิดข้อผิดพลาด!", error.message, "error");
    }
  };

  return (
    <div
      className="container mt-5 d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#C8E6B2" }}
    >
      <div
        className="w-75 p-5"
        style={{ backgroundColor: "#fff", borderRadius: "10px" }}
      >
        {" "}
        {/* Increased width and padding */}
        <h1 className="text-center">เพิ่มหมายเลขโต๊ะใหม่</h1>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="tableNumber" className="form-label">
              หมายเลขโต๊ะ
            </label>
            <input
              type="text"
              className="form-control form-control-lg" // Made the input larger
              id="tableNumber"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-100">
            บันทึก
          </button>{" "}
          {/* Made the button larger */}
        </form>
      </div>
    </div>
  );
};

export default AddTable;
