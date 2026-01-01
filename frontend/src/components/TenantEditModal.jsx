import { useState } from "react";
import { updateTenant } from "../api/tenantApi";
import '../styles/Tenants.css';
import Modal from "./Modal";

const TenantEditModal = ({ tenant, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    name: tenant.name,
    status: tenant.status,
    subscriptionPlan: tenant.subscriptionPlan,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateTenant(tenant.id, form);
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Tenant">
      <form onSubmit={handleSubmit}>
        <input className="input-field"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tenant Name"
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>

        <select
          name="subscriptionPlan"
          value={form.subscriptionPlan}
          onChange={handleChange}
        >
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>

        <div style={{ marginTop: "10px" , gap: "10px", display: "flex" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TenantEditModal;