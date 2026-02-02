import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../config/baseUrl";
import type { Officer } from "../types";
import { useNavigate } from "react-router-dom";

export default function LogInPage() {
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [user] = useState<Officer | null>(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const authenticateUser = async () => {
      try {
        const res = await axios.post(`${baseURL}/users/login`, {
          lastName,
          password,
        });
        if (res.status === 200) {
          sessionStorage.setItem("user", JSON.stringify(res.data));
          navigate("/");
        }
      } catch (err: any) {
        if (err.response) {
          switch (err.response.status) {
            case 401:
              window.alert("Wrong password!");
              break;
            case 404:
              console.log("User not found");
              break;
            default:
              console.log("Login error:", err.response.data.message);
          }
        } else {
          console.log("Network or other error:", err.message);
        }
      }
    };

    authenticateUser();
  };

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f6f8",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "320px",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          backgroundColor: "#fff",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#e53935",
            color: "#fff",
            fontWeight: 600,
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#d32f2f")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#e53935")
          }
        >
          Log In
        </button>
      </form>
    </div>
  );
}
