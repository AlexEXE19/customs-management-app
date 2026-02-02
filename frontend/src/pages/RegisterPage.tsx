import { useState } from "react";
import axios from "axios";
import baseURL from "../config/baseUrl"; // your backend base URL

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("OFFICER");
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
        // Clear form
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
    <div style={{ maxWidth: "300px", margin: "50px auto" }}>
      <h2>Register a new officer</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button type="submit" style={{ width: "100%", padding: "8px" }}>
          Register
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "10px", color: "green" }}>{message}</p>
      )}
    </div>
  );
}
