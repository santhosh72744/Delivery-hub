import React, { useEffect, useState } from "react";
import "./AdminDashboard.css"; 

function AdminDashboard() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  const [verifyShipmentId, setVerifyShipmentId] = useState(null);
  const [verifyComment, setVerifyComment] = useState("");
  const [labelShipmentId, setLabelShipmentId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
 

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await fetch("/api/admin/shipments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.reload();
        return;
      }

      const data = await res.json();

      if (data.success) {
        setShipments(data.shipments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const callAction = async (id, endpoint, body = null) => {
    try {
      const res = await fetch(`/api/shipments/${id}/${endpoint}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (res.ok) {
        fetchShipments();
      } else {
        const data = await res.json();
        alert(data.message || "Action failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitLabelUpload = async () => {
  if (!selectedFile) {
    alert("Please select a PDF file.");
    return;
  }

  const formData = new FormData();
  formData.append("label", selectedFile);

  try {
    const res = await fetch(
      `/api/shipments/${labelShipmentId}/generate-label`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (res.ok) {
      setLabelShipmentId(null);
      setSelectedFile(null);
      fetchShipments();
    } else {
      const data = await res.json();
      alert(data.message || "Upload failed");
    }
  } catch (err) {
    console.error(err);
  }
};

  const openVerifyModal = (id) => {
  setVerifyShipmentId(id);
  setVerifyComment("");
};

const submitVerification = async () => {
  if (!verifyComment.trim()) {
    alert("Comment is required.");
    return;
  }

  await callAction(verifyShipmentId, "verify", {
    comment: verifyComment,
  });

  setVerifyShipmentId(null);
};

  const renderActionButton = (s) => {
    switch (s.workflow_status) {
     case "NEW":
  return (
    <button
      className="action-btn btn-verify"
      onClick={() => openVerifyModal(s.id)}
    >
      Verify
    </button>
  );

  

     case "VERIFIED":
  return (
    <button
      className="action-btn btn-label"
      onClick={() => setLabelShipmentId(s.id)}
    >
      Upload Label
    </button>
  );

     case "LABEL_GENERATED":
  return (
    <button
      className="action-btn btn-transit"
      onClick={() =>
        callAction(s.id, "start-transit", {
          trackingNumber: `FEDEX${s.reference_code.replace(/-/g, "")}`,
          courier: "FEDEX"
        })
      }
    >
      Start Transit
    </button>
  );

      case "IN_TRANSIT":
        return (
          <button
            className="action-btn btn-delivered"
            onClick={() => callAction(s.id, "mark-delivered")}
          >
            Mark Delivered
          </button>
        );

      case "DELIVERED":
        return (
          <button
            className="action-btn btn-feedback"
            onClick={() => callAction(s.id, "request-feedback")}
          >
            Request Feedback
          </button>
        );

      case "FEEDBACK_PENDING":
        return (
          <button
            className="action-btn btn-close"
            onClick={() => callAction(s.id, "close")}
          >
            Close Shipment
          </button>
        );

      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-text">Loading shipments...</div>
      </div>
    );
  }

  

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <div className="dashboard-title">Shipping Control Center</div>
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <div className="dashboard-content">
        <div className="table-container">
          <table className="shipment-table">
            <thead className="table-head">
              <tr>
                <th className="th-ref">Reference</th>
                <th className="th-route">Route</th>
                <th className="th-amount">Amount</th>
                <th className="th-workflow">Workflow</th>
                <th className="th-tracking">Tracking</th>
                <th className="th-courier">Courier</th>
                <th className="th-created">Created</th>
                <th className="th-action">Action</th>
              </tr>
            </thead>

            <tbody className="table-body">
              {shipments.map((s) => (
                <tr className="table-row" key={s.id}>
                  <td className="cell-ref">
                    <div className="ref-code">{s.reference_code}</div>
                  </td>

                  <td className="cell-route">
                    <div className="route-value">{s.route}</div>
                  </td>

                  <td className="cell-amount">
                    <div className="amount-value">
                      ${s.final_amount}
                    </div>
                  </td>

                 <td className="cell-workflow">
  <div className="workflow-container">

    <div className={`status-pill status-${s.workflow_status.toLowerCase()}`}>
      {s.workflow_status.replace("_", " ")}
    </div>

    <div className="workflow-meta">
      <div className="meta-updated">
        Last updated:
{s.updated_at
  ? new Date(s.updated_at).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    })
  : "-"}
      </div>
    </div>
  </div>
</td>

                 <td className="cell-tracking">
  <div className="tracking-value">
    {s.tracking_number ? (
      <a
        href={`https://www.fedex.com/fedextrack/?trknbr=${s.tracking_number}`}
        target="_blank"
        rel="noopener noreferrer"
        className="tracking-link"
      >
        {s.tracking_number}
      </a>
    ) : (
      "-"
    )}
  </div>
</td>

                  <td className="cell-courier">
                    <div className="courier-value">
                      {s.courier || "-"}
                    </div>
                  </td>

                  <td className="cell-created">
  <div className="created-value">
   {new Date(s.created_at).toLocaleString("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
})}
  </div>
</td>

                  <td className="cell-action">
                    <div className="action-wrapper">
                      {renderActionButton(s)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    {verifyShipmentId && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>Verification Comment</h3>

      <textarea
        className="modal-textarea"
        value={verifyComment}
        onChange={(e) => setVerifyComment(e.target.value)}
        placeholder="Enter verification details..."
      />

      <div className="modal-actions">
        <button
          className="btn-cancel"
          onClick={() => setVerifyShipmentId(null)}
        >
          Cancel
        </button>

        <button
          className="btn-submit"
          onClick={submitVerification}
        >
          Confirm Verify
        </button>
      </div>
    </div>
  </div>
)}

{labelShipmentId && (
  <div className="modal-overlay">
    <div className="modal-box">
      <div className="modal-title">Upload Shipping Label (PDF)</div>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        className="modal-file-input"
      />

      <div className="modal-actions">
        <button
          className="modal-cancel-btn"
          onClick={() => {
            setLabelShipmentId(null);
            setSelectedFile(null);
          }}
        >
          Cancel
        </button>

        <button
          className="modal-submit-btn"
          onClick={submitLabelUpload}
        >
          Upload
        </button>
      </div>
    </div>
  </div>
)}



    </div>
  );
}

export default AdminDashboard;