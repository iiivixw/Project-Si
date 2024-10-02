import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function Dashboard() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("cookToken");
    router.push("/login");
  };

  useEffect(() => {
    // Set background color for the entire page
    document.body.style.backgroundColor = "#C8E6B2"; // Light green background
    return () => {
      // Reset background color when component unmounts
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      router.push("/login");
    }
  }, [router]);

  const handleManageFood = () => {
    router.push("/all-food");
  };

  const handleManageTables = () => {
    router.push("/manage-tables"); // Assuming you have a page for managing tables
  };

  return (
    <div className="dashboard mt-3 text-center" style={{ minHeight: "100vh" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome back Admin</p>
    </div>
  );
}
