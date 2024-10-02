import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Set background color for the entire page
    document.body.style.backgroundColor = "#C8E6B2"; // Green background
    return () => {
      // Reset background color when component unmounts
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "1111") {
      const adminToken = "admin-token"; // Replace with actual token generation logic
      localStorage.setItem("adminToken", adminToken);
      router.push("/admin/dashboard");
    } else if (username === "cook" && password === "2222") {
      const cookToken = "cook-token"; // Replace with actual token generation logic
      localStorage.setItem("cookToken", cookToken);
      router.push("/cook/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="row">
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?fit=crop&w=600&q=80"
            alt="อาหาร"
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div
            className="w-100 p-4"
            style={{ backgroundColor: "#ffffff", borderRadius: "10px" }}
          >
            <h1 className="text-center mb-4" style={{ color: "#343a40" }}>
              Login
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label fw-bold">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-bold">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
