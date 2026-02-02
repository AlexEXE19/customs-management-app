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
  // Load user from sessionStorage
  const [user] = useState<Officer | null>(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? (JSON.parse(stored) as Officer) : null;
  });

  useEffect(() => {
    if (user) sessionStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // Role protection
  useEffect(() => {
    const isSuperintendent = user?.role.toLowerCase() === "superintendent";
    console.log(user?.role.toLowerCase());
    if (!isSuperintendent) {
      navigate("/dashboard");
      window.alert("Unauthorized access!");
    }
  }, [user, navigate]);

  const [loading, setLoading] = useState(true);
  const [importedCount, setImportedCount] = useState<number | null>(null);

  // Fetch persons from backend
  useEffect(() => {
    const fetchPersonsChecked = async () => {
      try {
        const res = await axios.get(`${baseURL}/checked-persons/all`);
        if (res.status === 200) {
          setPersonsChecked(res.data);
          setLoading(false);
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
  console.log(personsChecked);

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  // Export to XLSX
  const exportToXLSX = () => {
    if (personsChecked && personsChecked !== null) {
      const worksheet = XLSX.utils.json_to_sheet(personsChecked);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "PersonsChecked");
      XLSX.writeFile(workbook, "persons_checked.xlsx");
    }
  };

  // Export to PDF
  const exportToPDF = () => {
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
      body: personsChecked?.map((p) => [
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

  // Import from XLSX
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
        setImportedCount(imported.length); // Show feedback
      }
    };

    reader.readAsArrayBuffer(file);
  };

  if (!user) return <p>Loading user...</p>;
  if (loading) return <p>Loading statistics...</p>;

  return (
    <>
      <RegisterPage />

      {/* Action Buttons */}
      <div
        style={{
          margin: "20px 0",
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <button onClick={goToDashboard}>Dashboard</button>
        <button onClick={exportToPDF}>Export PDF</button>
        <button onClick={exportToXLSX}>Export XLSX</button>

        <label
          style={{
            cursor: "pointer",
            background: "#eee",
            padding: "6px 12px",
            borderRadius: 4,
          }}
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
          <span style={{ marginLeft: 10 }}>
            Imported {importedCount} rows successfully!
          </span>
        )}
      </div>

      {/* Chart updates automatically on import */}
      <EntryApprovalBarChart
        key={personsChecked?.length}
        persons={personsChecked}
      />
    </>
  );
}
