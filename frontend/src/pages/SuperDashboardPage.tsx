import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import RegisterPage from "./RegisterPage";
import EntryApprovalBarChart from "./EntryApprovalBarChart";
import { type Officer, type PersonChecked } from "../types";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import baseURL from "../config/baseUrl";

export default function SuperDashboardPage() {
  const navigate = useNavigate();

  const [personsChecked, setPersonsChecked] = useState<
    PersonChecked[] | null
  >();
  const [user] = useState<Officer | null>(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? (JSON.parse(stored) as Officer) : null;
  });

  const [loading, setLoading] = useState(true);
  const [importedCount, setImportedCount] = useState<number | null>(null);

  useEffect(() => {
    if (user) sessionStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const isSuperintendent = user?.role.toLowerCase() === "superintendent";
    if (!isSuperintendent) {
      window.alert("Unauthorized access!");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchPersonsChecked = async () => {
      try {
        const res = await axios.get(`${baseURL}/checked-persons/all`);
        if (res.status === 200) {
          setPersonsChecked(res.data);
        }
      } catch (err: any) {
        if (err.response?.status === 404) setPersonsChecked(null);
        else console.error("Fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonsChecked();
  }, []);

  const goToDashboard = () => navigate("/dashboard");

  const exportToXLSX = () => {
    if (!personsChecked) return;
    const worksheet = XLSX.utils.json_to_sheet(personsChecked);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PersonsChecked");
    XLSX.writeFile(workbook, "persons_checked.xlsx");
  };

  const exportToPDF = () => {
    if (!personsChecked) return;
    const doc = new jsPDF();
    doc.text("Persons Checked Report", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [
        [
          "ID",
          "First Name",
          "Last Name",
          "Nationality",
          "Document",
          "Purpose",
          "Risk",
          "Approved",
          "Checked Date",
          "Officer",
        ],
      ],
      body: personsChecked.map((p) => [
        p.id,
        p.firstName,
        p.lastName,
        p.nationality,
        p.documentType,
        p.entryPurpose,
        p.riskLevel,
        p.entryApproved ? "Yes" : "No",
        p.chekedDate,
        p.officerId,
      ]),
    });

    doc.save("persons_checked.pdf");
  };

  const importFromXLSX = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      if (!data) return;

      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsed: any[] = XLSX.utils.sheet_to_json(sheet);

      const imported: PersonChecked[] = parsed.map((row) => ({
        id: row.id || "",
        firstName: row.firstName || "",
        lastName: row.lastName || "",
        nationality: row.nationality || "",
        homeCity: row.homeCity || "",
        documentType: row.documentType as
          | "Passport"
          | "National's ID"
          | "Driving License",
        entryPurpose: row.entryPurpose as
          | "Tourism"
          | "Business"
          | "Work"
          | "Transit"
          | "Studies",
        riskLevel: Number(row.riskLevel) || 1,
        issueDate: row.issueDate || "",
        chekedDate: row.chekedDate || "",
        entryApproved:
          row.entryApproved === true || row.entryApproved === "true",
        officerId: row.officerId || "",
      }));

      if (imported.length > 0) {
        setPersonsChecked(imported);
        setImportedCount(imported.length);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  if (!user) return <p>Loading user...</p>;
  if (loading) return <p>Loading statistics...</p>;

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <RegisterPage />

      <div
        style={{
          margin: "20px 0",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <button
          onClick={goToDashboard}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#1976d2",
            color: "#fff",
            fontWeight: 500,
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
          Dashboard
        </button>

        <button
          onClick={exportToPDF}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#d32f2f",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#b71c1c")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#d32f2f")
          }
        >
          Export PDF
        </button>

        <button
          onClick={exportToXLSX}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#388e3c",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#2e7d32")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#388e3c")
          }
        >
          Export XLSX
        </button>

        <label
          style={{
            cursor: "pointer",
            backgroundColor: "#f5f5f5",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontWeight: 500,
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#e0e0e0")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#f5f5f5")
          }
        >
          Import XLSX
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={importFromXLSX}
            style={{ display: "none" }}
          />
        </label>

        {importedCount !== null && (
          <span style={{ marginLeft: "10px", fontWeight: 500, color: "#333" }}>
            Imported {importedCount} rows successfully!
          </span>
        )}
      </div>

      <EntryApprovalBarChart
        key={personsChecked?.length}
        persons={personsChecked}
      />
    </div>
  );
}
