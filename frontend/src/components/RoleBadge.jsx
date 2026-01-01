export default function RoleBadge({ role }) {
  const formattedRole = role.replace("_", " ").toUpperCase();

  return (
    <span className={`role-badge ${role}`} title={formattedRole}>
      {formattedRole}
    </span>
  );
}
