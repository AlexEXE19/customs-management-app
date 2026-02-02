import { useState, useEffect } from "react";
import CheckDocumentPage from "./CheckDocumentPage";
import { type PersonChecked } from "../types";
import baseURL from "../config/baseUrl";
import axios from "axios";
import { Link, useNavigate } from "react-router";

export default function DashboardPage() {
  const storedUser = sessionStorage.getItem("user");

  const navigate = useNavigate();

  if (storedUser) {
    const user = JSON.parse(storedUser);
    console.log(user);
  }
  const [personsChecked, setPersonsChecked] = useState<
    PersonChecked[] | null
  >();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "allowed" | "denied"
  >("all");

  useEffect(() => {
    const fetchPersonsChecked = async () => {
      try {
        const res = await axios.get(`${baseURL}/checked-persons/all`);
        if (res.status === 200) {
          setPersonsChecked(res.data);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setPersonsChecked(null);
        } else {
          console.error("Fetch error:", err.message);
        }
      }
    };
    fetchPersonsChecked();
  }, []);

  const updateRiskLevel = async (id: string, newLevel: 1 | 2 | 3) => {
    try {
      const res = await axios.put(`${baseURL}/persons/${id}/risk`, null, {
        params: { riskLevel: newLevel },
      });

      if (res.status === 200) {
        setPersonsChecked((prev) => {
          if (!prev) return prev;

          return prev.map((person) =>
            person.id === id ? { ...person, riskLevel: newLevel } : person,
          );
        });
        console.log(`Risk level for person ${id} updated to ${newLevel}`);
      }
    } catch (err: any) {
      console.error("Failed to update risk level:", err);
    }
  };

  const filteredPersons = (personsChecked || []).filter((person) => {
    const matchesSearch =
      person.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "allowed"
          ? person.entryApproved
          : !person.entryApproved;

    return matchesSearch && matchesStatus;
  });

  const getRiskColor = (level: number) => {
    switch (level) {
      case 1:
        return { bg: "#DEF7EC", text: "#03543F" };
      case 2:
        return { bg: "#FEECDC", text: "#8A2C0D" };
      case 3:
        return { bg: "#FDE8E8", text: "#9B1C1C" };
      default:
        return { bg: "#eee", text: "#333" };
    }
  };

  const removeLastThreeRows = () => {
    setPersonsChecked((prev) => {
      if (!prev) return prev;
      return prev.slice(0, Math.max(prev.length - 3, 0));
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const tableHeaderStyle = {
    padding: "12px",
    textAlign: "left" as const,
    backgroundColor: "#f4f4f4",
    borderBottom: "2px solid #ddd",
  };
  const cellStyle = { padding: "12px", borderBottom: "1px solid #eee" };
  const inputStyle = {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginRight: "10px",
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Customs Control Dashboard</h1>

      <CheckDocumentPage />

      <section style={{ marginTop: "40px" }}>
        <h2>Check History</h2>

        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search by ID or Last Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, width: "300px" }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            style={inputStyle}
          >
            <option value="all">All Entries</option>
            <option value="allowed">Allowed Only</option>
            <option value="denied">Denied Only</option>
          </select>
          <span style={{ color: "#666" }}>
            Showing {filteredPersons.length} results
          </span>
          ;
          <Link style={{ padding: "10px" }} to="/super-dashboard">
            Go to super dashboard
          </Link>
        </div>

        {!personsChecked ? (
          <p>Loading history...</p>
        ) : filteredPersons.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Document ID</th>
                <th style={tableHeaderStyle}>Full Name</th>
                <th style={tableHeaderStyle}>Nationality</th>
                <th style={tableHeaderStyle}>Risk Level</th>
                <th style={tableHeaderStyle}>Decision</th>
                <th style={tableHeaderStyle}>Officer ID</th>
                <th style={tableHeaderStyle}>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredPersons.map((record, index) => {
                return (
                  <tr key={`${record.id}-${index}`}>
                    <td style={cellStyle}>
                      <strong>{record.id}</strong>
                    </td>
                    <td style={cellStyle}>
                      {record.firstName} {record.lastName}
                    </td>
                    <td style={cellStyle}>{record.nationality}</td>

                    {/* RISK BUTTONS */}
                    <td style={cellStyle}>
                      {[1, 2, 3].map((lvl) => {
                        const active = record.riskLevel === lvl;
                        const colors = getRiskColor(lvl);

                        return (
                          <button
                            key={lvl}
                            onClick={() =>
                              updateRiskLevel(record.id, lvl as 1 | 2 | 3)
                            }
                            style={{
                              marginRight: "6px",
                              padding: "6px 10px",
                              borderRadius: "10px",
                              fontWeight: "bold",
                              border: "1px solid #ccc",
                              cursor: "pointer",
                              backgroundColor: active ? colors.bg : "#f0f0f0",
                              color: active ? colors.text : "#555",
                            }}
                          >
                            {lvl}
                          </button>
                        );
                      })}
                    </td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          fontWeight: "bold",
                          color: record.entryApproved ? "green" : "red",
                        }}
                      >
                        {record.entryApproved ? "ALLOWED" : "DENIED"}
                      </span>
                    </td>

                    <td style={cellStyle}>{record.officerId}</td>
                    <td style={cellStyle}>
                      {new Date(record.chekedDate).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          margin: "20px 0",
        }}
      >
        <button
          onClick={removeLastThreeRows}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#e53935",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Clean Last 3 Rows
        </button>

        <button
          onClick={handleLogout}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#e53935",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
