import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RootPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = sessionStorage.getItem("user");

    const timeout = setTimeout(() => {
      navigate(user ? "/dashboard" : "/auth/login");
    }, 800);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          padding: "40px",
          borderRadius: "14px",
          backgroundColor: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "10px", color: "#333" }}>Welcome</h2>
        <p style={{ color: "#666", fontSize: "15px" }}>
          Redirecting you to the right place…
        </p>
      </div>
    </div>
  );
}
