import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
    const router = useRouter();
    const [isLocalhost, setIsLocalhost] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin

    useEffect(() => {
        // Check if the URL is localhost
        const currentURL = window.location.href;
        setIsLocalhost(currentURL.includes('localhost'));

        // Check login status
        const adminToken = localStorage.getItem("adminToken");
        const cookToken = localStorage.getItem("cookToken");

        console.log("Admin Token:", adminToken); // Debugging
        console.log("Cook Token:", cookToken);   // Debugging

        if (adminToken) {
            setIsLoggedIn(true);
            setIsAdmin(true); // Set admin status if admin token exists
            console.log("Admin is logged in");
        } else if (cookToken) {
            setIsLoggedIn(true);
            console.log("Cook is logged in");
        } else {
            console.log("No user is logged in");
        }
    }, []);

    // Logout function
    const logout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("cookToken");
        setIsLoggedIn(false);
        setIsAdmin(false); // Reset admin status on logout
        router.push("/login");
    };

    return (
      <nav
        className="navbar navbar-expand-lg shadow p-3"
        style={{ backgroundColor: "#397d54" }}
      >
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="/">
            ORDER BUFFET
          </a>
          <button
            className="navbar-toggler bg-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              {/* Check if on localhost and not logged in */}
              {isLocalhost && !isLoggedIn ? (
                <li className="nav-item">
                  <a className="nav-link text-white" href="/login">
                    Login
                  </a>
                </li>
              ) : isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <button
                      onClick={logout}
                      className="nav-link text-white btn btn-link"
                      style={{ textDecoration: "none" }}
                    >
                      Logout
                    </button>
                  </li>
                  {/* Show Manage Food and Manage Tables buttons if user is admin */}
                  {isAdmin && (
                    <>
                      <li className="nav-item">
                        <a
                          className="nav-link text-white"
                          href="/admin/all_food"
                        >
                          จัดการข้อมูลเมนูอาหาร
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link text-white"
                          href="/admin/all_table"
                        >
                          จัดการข้อมูลโต๊ะ
                        </a>
                      </li>
                    </>
                  )}
                </>
              ) : null}
            </ul>
          </div>
        </div>
      </nav>
    );
}
