import { useState } from "react";
import axios from "axios";
import baseURL from "../config/baseUrl";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("OFFICER");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${baseURL}/users/register`, {
        firstName,
        lastName,
        password,
        role,
      });

      if (res.status === 200) {
        setMessage(
          `Officer registered successfully: ${res.data.firstName} ${res.data.lastName}`,
        );
        setFirstName("");
        setLastName("");
        setPassword("");
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setMessage("Officer with this last name already exists!");
      } else {
        setMessage("Registration failed, try again.");
        console.error(err);
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: "300px",
        margin: "50px auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Register a new officer</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
        }}
      >
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#1976d2",
            color: "#fff",
            fontWeight: 600,
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#1565c0")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#1976d2")
          }
        >
          Register
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "10px", color: "green", textAlign: "center" }}>
          {message}
        </p>
      )}
    </div>
  );
}
