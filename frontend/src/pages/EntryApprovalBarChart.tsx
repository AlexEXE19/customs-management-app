import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

import { type PersonChecked } from "../types";

type DateFilter = "ALL" | "TODAY" | "LAST_7_DAYS";

function parseCheckedDate(value: string): Date {
  const [datePart, timePart] = value.split(" ");
  const [day, month, year] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute);
}

const FALLBACK_PERSONS: PersonChecked[] = [
  {
    id: "P-882931",
    firstName: "Alex",
    lastName: "Moran",
    nationality: "US",
    homeCity: "New York",
    documentType: "Passport",
    entryPurpose: "Tourism",
    riskLevel: 1,
    issueDate: "01-01-2020",
    chekedDate: "20-01-2026 10:30",
    entryApproved: true,
    officerId: "1",
  },
  {
    id: "ID-441200",
    firstName: "Dimitri",
    lastName: "Volkov",
    nationality: "RU",
    homeCity: "Moscow",
    documentType: "National's ID",
    entryPurpose: "Business",
    riskLevel: 3,
    issueDate: "15-05-2021",
    chekedDate: "20-01-2026 11:15",
    entryApproved: false,
    officerId: "1",
  },
];

interface Props {
  persons: unknown;
}

export default function EntryApprovalBarChart({ persons }: Props) {
  const safePersons: PersonChecked[] = Array.isArray(persons)
    ? persons
    : FALLBACK_PERSONS;

  const [filter, setFilter] = useState<DateFilter>("ALL");

  const now = new Date();

  const filteredPersons = safePersons.filter((p) => {
    const checkedDate = parseCheckedDate(p.chekedDate);

    if (filter === "TODAY") {
      return (
        checkedDate.getDate() === now.getDate() &&
        checkedDate.getMonth() === now.getMonth() &&
        checkedDate.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "LAST_7_DAYS") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return checkedDate >= sevenDaysAgo;
    }

    return true;
  });

  const approved = filteredPersons.filter((p) => p.entryApproved).length;
  const denied = filteredPersons.filter((p) => !p.entryApproved).length;

  const data = [
    { status: "Approved", count: approved },
    { status: "Denied", count: denied },
  ];

  return (
    <div
      style={{
        marginTop: 40,
        padding: 20,
        maxWidth: 600,
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: 20 }}>
        Entry Approval Overview
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {["ALL", "TODAY", "LAST_7_DAYS"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as DateFilter)}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #1976d2",
              backgroundColor: filter === f ? "#1976d2" : "#fff",
              color: filter === f ? "#fff" : "#1976d2",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              if (filter !== f)
                e.currentTarget.style.backgroundColor = "#e3f2fd";
            }}
            onMouseOut={(e) => {
              if (filter !== f) e.currentTarget.style.backgroundColor = "#fff";
            }}
          >
            {f === "ALL" ? "All" : f === "TODAY" ? "Today" : "Last 7 Days"}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <BarChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} />
        </BarChart>
      </div>
    </div>
  );
}
