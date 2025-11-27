import React from 'react';
import '../../styles/AdminOverview.css';

interface AdminOverviewProps {
  stats: any;
}

const AdminOverview: React.FC<AdminOverviewProps> = ({ stats }) => {
  return (
    <div className="admin-overview">
      <h2 className="page-title">📊 Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-header">
            <span className="stat-icon">👥</span>
            <h3>Total Users</h3>
          </div>
          <div className="stat-value">{stats?.users?.total || 0}</div>
          <div className="stat-breakdown">
            <div className="breakdown-item">
              <span>👨‍🎓 Students:</span>
              <strong>{stats?.users?.students || 0}</strong>
            </div>
            <div className="breakdown-item">
              <span>👨‍🏫 Teachers:</span>
              <strong>{stats?.users?.teachers || 0}</strong>
            </div>
            <div className="breakdown-item">
              <span>👨‍💼 Admins:</span>
              <strong>{stats?.users?.admins || 0}</strong>
            </div>
          </div>
        </div>

        <div className="stat-card courses">
          <div className="stat-header">
            <span className="stat-icon">📚</span>
            <h3>Courses</h3>
          </div>
          <div className="stat-value">{stats?.courses?.total || 0}</div>
          <div className="stat-breakdown">
            <div className="breakdown-item">
              <span>✅ Published:</span>
              <strong>{stats?.courses?.published || 0}</strong>
            </div>
            <div className="breakdown-item">
              <span>📝 Draft:</span>
              <strong>{stats?.courses?.draft || 0}</strong>
            </div>
          </div>
        </div>

        <div className="stat-card enrollments">
          <div className="stat-header">
            <span className="stat-icon">🎓</span>
            <h3>Enrollments</h3>
          </div>
          <div className="stat-value">{stats?.courses?.enrollments || 0}</div>
          <div className="stat-footer">
            Total active enrollments
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>⚡ Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">➕</span>
            <div className="action-text">
              <strong>Add New Course</strong>
              <small>Create a new course</small>
            </div>
          </button>
          <button className="action-btn">
            <span className="action-icon">👤</span>
            <div className="action-text">
              <strong>Add User</strong>
              <small>Create student or teacher</small>
            </div>
          </button>
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <div className="action-text">
              <strong>View Reports</strong>
              <small>Analytics & insights</small>
            </div>
          </button>
          <button className="action-btn">
            <span className="action-icon">⚙️</span>
            <div className="action-text">
              <strong>Settings</strong>
              <small>System configuration</small>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
