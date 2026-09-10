import "./StatCard.css";

export function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">
        <Icon size={20} />
      </div>
      <div>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
        {helper && <div className="stat-card-helper">{helper}</div>}
      </div>
    </div>
  );
}
