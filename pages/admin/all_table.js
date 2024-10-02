import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2"; // นำเข้า SweetAlert

const AllTables = () => {
  const [tables, setTables] = useState([]);
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

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tables");
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(
            errorResponse.error || "เกิดข้อผิดพลาดในการดึงข้อมูลโต๊ะ"
          );
        }
        const data = await response.json();
        setTables(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      }
    };
    fetchTables();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือ?",
      text: "คุณจะไม่สามารถกู้คืนได้อีก!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบเลย!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/tables/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("เกิดข้อผิดพลาดในการลบโต๊ะ");
        setTables(tables.filter((table) => table.id !== id));
        Swal.fire("ลบแล้ว!", "โต๊ะของคุณได้ถูกลบแล้ว.", "success");
      } catch (error) {
        setError(error.message);
        Swal.fire("เกิดข้อผิดพลาด!", error.message, "error");
      }
    }
  };

  return (
    <div
      className="container-sm text-center mt-5"
      style={{ backgroundColor: "#C8E6B2", minHeight: "100vh" }} // Ensure full-height container
    >
      <h1 className="text-center">จัดการข้อมูลโต๊ะ</h1>
      <a href="/admin/add_table" className="btn btn-success my-4">
        เพิ่มหมายเลขโต๊ะ
      </a>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>หมายเลขโต๊ะ</th>
            <th>จัดการข้อมูล</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.id}>
              <td>{table.table_number}</td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => router.push(`/admin/manage_table/${table.id}`)}
                >
                  แก้ไข
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(table.id)}
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
};

export default AllTables;
