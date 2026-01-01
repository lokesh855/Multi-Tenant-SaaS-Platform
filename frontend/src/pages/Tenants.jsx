import { useEffect, useState } from "react";
import { getTenants } from "../api/tenantApi";
import TenantEditModal from "../components/TenantEditModal";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import '../styles/Tenants.css';

const Tenants = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTenant, setSelectedTenant] = useState(null);

    const fetchTenants = async () => {
        try {
            setLoading(true);
            const res = await getTenants();
            setTenants(res.data.data.tenants);
        } catch (err) {
            console.error("Failed to fetch tenants", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    if (loading) return <LoadingSpinner isVisible={true} message="Loading tenants..." />;

    return (
        <div>
            <Navbar />
            <div className="page">
            <h2>Tenants Management</h2>

            <table border="1" width="100%" cellPadding="8">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Subdomain</th>
                        <th>Status</th>
                        <th>Plan</th>
                        <th>Users</th>
                        <th>Projects</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {tenants.map((tenant) => (
                        <tr key={tenant.id}>
                            <td data-label="Name">{tenant.name}</td>
                            <td data-label="Subdomain">{tenant.subdomain}</td>
                            <td data-label="Status">{tenant.status}</td>
                            <td data-label="Plan">{tenant.subscriptionPlan}</td>
                            <td data-label="Users">{tenant.totalUsers}</td>
                            <td data-label="Projects">{tenant.totalProjects}</td>
                            <td data-label="Actions">
                                <button onClick={() => setSelectedTenant(tenant)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedTenant && (
                <TenantEditModal
                    tenant={selectedTenant}
                    onClose={() => setSelectedTenant(null)}
                    onUpdated={fetchTenants}
                />
            )}
            </div>
        </div>
    );
};

export default Tenants;