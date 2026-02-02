import { useState } from "react";
import axios from "axios";
import baseURL from "../config/baseUrl";
import type { Person } from "../types";

export default function CheckDocumentPage() {
  const [documentId, setDocumentId] = useState("");
  const [personInformation, setPersonInformation] = useState<Person | null>(
    null,
  );
  const [isIdFound, setIsIdFound] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIdFound(null);
    setError(null);
    setPersonInformation(null);

    try {
      const res = await axios.get(`${baseURL}/persons/${documentId}`);

      if (res.status === 200) {
        setPersonInformation(res.data);
        setIsIdFound(true);
        setIsModalOpen(true);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setIsIdFound(false);
      } else {
        setError("Failed to connect to the server. Please try again later.");
        console.error(err);
      }
    }
  };

  const handleChoice = (type: String) => {
    setIsModalOpen(false);
    const userStr = sessionStorage.getItem("user");
    const currentUserId = userStr ? JSON.parse(userStr).id : null;
    console.log(currentUserId);
    const addUser = async () => {
      try {
        const res = await axios.post(`${baseURL}/checked-persons/add`, null, {
          params: {
            personId: documentId,
            approved: type === "allow" ? true : false,
            officerId: currentUserId,
          },
        });
        if (res.status === 200) {
          console.log("Person checked added successfuly!");
        }
      } catch (err: any) {
        console.error(err);
      }
    };
    addUser();
  };

  return (
    <div className="container">
      <h3>Check document number against the database</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Document ID"
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
          required
        />
        <button type="submit">Check</button>
      </form>

      {/* Not found */}
      {isIdFound === false && (
        <p style={{ color: "red" }}>❌ Document ID not found</p>
      )}

      {/* Network error */}
      {error && <p style={{ color: "orange" }}>⚠️ {error}</p>}

      {/* MODAL */}
      {isModalOpen && personInformation && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Person Information</h2>

            <p>
              <strong>First Name:</strong> {personInformation.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {personInformation.lastName}
            </p>
            <p>
              <strong>Nationality:</strong> {personInformation.nationality}
            </p>
            <p>
              <strong>Home City:</strong> {personInformation.homeCity}
            </p>
            <p>
              <strong>Document Type:</strong> {personInformation.documentType}
            </p>
            <p>
              <strong>Entry Purpose:</strong> {personInformation.entryPurpose}
            </p>
            <p>
              <strong>Issue Date:</strong> {personInformation.issueDate}
            </p>
            <p>
              <strong>Risk Level:</strong> {personInformation.riskLevel}
            </p>

            <div className="modal-actions">
              <button
                className="allow"
                onClick={() => {
                  handleChoice("allow");
                }}
              >
                ✅ Allow
              </button>
              <button
                className="deny"
                onClick={() => {
                  handleChoice("deny");
                }}
              >
                ❌ Deny
              </button>
            </div>

            <button className="close" onClick={() => setIsModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
