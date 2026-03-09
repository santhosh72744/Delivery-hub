import React, { useState, useEffect } from "react";
import "./AdminCashBook.css";

function AdminCashBook() {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [entries, setEntries] = useState([]);

  const [form, setForm] = useState({
  date: "",
  type: "INFLOW",
  category: "",
  description: "",
  amount: "",
  paid_by: "",
  paid_to: "",
  status: "PAID",
  reference: "",
  attachment: null
});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "attachment") {
      setForm({ ...form, attachment: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const saveEntry = async () => {
    if (!form.date || !form.description || !form.amount || !form.paid_by || !form.paid_to) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      const formData = new FormData();
      formData.append("date", form.date);
      formData.append("type", form.type);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("amount", form.amount);
      formData.append("paid_by", form.paid_by);
      formData.append("paid_to", form.paid_to);
      formData.append("status", form.type === "INFLOW" ? "PAID" : form.status);
      formData.append("reference", form.reference);
      if (form.attachment) {
        formData.append("attachment", form.attachment);
      }

      let res;

      if (editId) {
        res = await fetch(`/api/admin/cashbook/${editId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
      } else {
        res = await fetch("/api/admin/cashbook", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
      }

      const data = await res.json();

      if (data.success) {
        fetchEntries();
        setEditId(null);
        setShowModal(false);

        setForm({
          date: "",
          type: "INFLOW",
          category: "",
          description: "",
          amount: "",
          paid_by: "",
          paid_to: "",
          status: "PAID",
          attachment: null
        });
      } else {
        alert("Save failed");
      }

    } catch (err) {
      console.error(err);
    }
  };

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch("/api/admin/cashbook", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setEntries(data.entries);
      }

    } catch (err) {
      console.error(err);
    }
  };

  const deleteEntry = async (id) => {
    const confirmDelete = window.confirm("Delete this entry?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`/api/admin/cashbook/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        fetchEntries();
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const totalInflow = entries
    .filter(e => e.type === "INFLOW")
    .reduce((sum, e) => sum + Number(e.amount_inr), 0);

  const totalOutflow = entries
    .filter(e => e.type === "OUTFLOW")
    .reduce((sum, e) => sum + Number(e.amount_inr), 0);

  const balance = totalInflow - totalOutflow;

  const toPay = entries
    .filter(e => e.type === "OUTFLOW" && e.status === "TO_BE_PAID")
    .reduce((sum, e) => sum + Number(e.amount_inr), 0);

  return (
    <div className="cashbook-container">

      <h2 className="cashbook-title">Cash Book</h2>

      <button
        className="cashbook-add-btn"
        onClick={() => {
  setEditId(null);

  setForm({
    date: "",
    type: "INFLOW",
    category: "",
    description: "",
    amount: "",
    paid_by: "",
    paid_to: "",
    status: "PAID",
    attachment: null
  });

  setShowModal(true);
}}
      >
        + Add Entry
      </button>

      <div className="cashbook-summary">

        <div className="cash-card">
          Total Inflow
          <div className="cash-value">₹{totalInflow}</div>
        </div>

        <div className="cash-card">
          Total Outflow
          <div className="cash-value">₹{totalOutflow}</div>
        </div>

        <div className="cash-card">
          Balance
          <div className="cash-value">₹{balance}</div>
        </div>

        <div className="cash-card">
          Pending To Pay
          <div className="cash-value">₹{toPay}</div>
        </div>

      </div>

      <div className="cashbook-table-wrapper">

        <table className="cashbook-table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Attachment</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {entries.map((e) => (
              <tr key={e.id}>

                <td>
                  {new Date(e.entry_date).toLocaleDateString("en-GB")}
                </td>

                <td>{e.type}</td>

                <td>{e.category}</td>

                <td>{e.description}</td>

                <td>₹{e.amount_inr}</td>

                <td>{e.status}</td>

                <td>
                  {e.attachment_url && (
                    <a
                      href={`/${e.attachment_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="attachment-link"
                    >
                      View
                    </a>
                  )}
                </td>

                <td className="cashbook-actions">

                  <button
                    className="edit-btn"
                    onClick={() => {
                      setForm({
                        date: e.entry_date,
                        type: e.type,
                        category: e.category || "",
                        description: e.description,
                        amount: e.amount_inr,
                        paid_by: e.paid_by,
                        paid_to: e.paid_to,
                        status: e.status
                      });

                      setEditId(e.id);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteEntry(e.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {showModal && (
        <div className="modal-overlay">

          <div className="modal-box">

            <h3 className="modal-title">Cash Book Entry</h3>

            <input
              className="modal-input"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />

            <select
              className="modal-input"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="INFLOW">Inflow</option>
              <option value="OUTFLOW">Outflow</option>
            </select>

            <input
              className="modal-input"
              type="text"
              name="category"
              value={form.category}
              placeholder="Category"
              onChange={handleChange}
            />

            {form.type === "OUTFLOW" && (
  <input
    className="modal-input"
    type="text"
    name="reference"
    value={form.reference}
    placeholder="Shipment Reference (DH-XXXX)"
    onChange={handleChange}
  />
)}

            <input
              className="modal-input"
              type="text"
              name="description"
              value={form.description}
              placeholder="Description"
              onChange={handleChange}
            />

            <input
              className="modal-input"
              type="number"
              name="amount"
              value={form.amount}
              placeholder="Amount"
              onChange={handleChange}
            />

            <input
              className="modal-input"
              type="text"
              name="paid_by"
              value={form.paid_by}
              placeholder="Paid By"
              onChange={handleChange}
            />

            <input
              className="modal-input"
              type="text"
              name="paid_to"
              value={form.paid_to}
              placeholder="Paid To"
              onChange={handleChange}
            />

            {form.type === "OUTFLOW" && (
              <select
                className="modal-input"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="PAID">Paid</option>
                <option value="TO_BE_PAID">To Be Paid</option>
              </select>
            )}

            <input
              className="modal-input"
              type="file"
              name="attachment"
              onChange={handleChange}
            />

            <div className="modal-actions">

              <button
                className="save-btn"
                onClick={saveEntry}
              >
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminCashBook;