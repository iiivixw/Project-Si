import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Dashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Set background color for the entire page
    document.body.style.backgroundColor = "#C8E6B2"; // Set the background color to green
    return () => {
      // Reset background color when component unmounts
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    // Check for cook token
    const cookToken = localStorage.getItem("cookToken");
    if (!cookToken) {
      // Redirect to login if token is not found
      router.push("/login");
    } else {
      fetchOrders(); // Fetch orders if token is found
    }
  }, [router]);

  // Function to fetch orders from API
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://172.20.10.3:5000/api/orders");
      setOrders(response.data); // Set the orders in state
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="dashboard mt-3" style={{ minHeight: "100vh" }}>
      <h1 className="text-center text-white">Order Dashboard</h1>

      <table className="table table-striped text-center mt-4 align-middle bg-white rounded">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>โต๊ะ</th>
            <th>รายการอาหาร</th>
            <th>จำนวน</th>
            <th>สั่งอาหารเมื่อ</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.table_number}</td>
                <td>
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    {JSON.parse(order.items).map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    {JSON.parse(order.items).map((item, index) => (
                      <li key={index}>{item.quantity} ถาด</li>
                    ))}
                  </ul>
                </td>
                <td>
                  {new Date(order.created_at).toLocaleString("th-TH", {
                    hour12: false,
                  })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">ไม่มีคำสั่งซื้อ</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
