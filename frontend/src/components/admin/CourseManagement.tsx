import React from 'react';
import '../../styles/StudentManagement.css';

const CourseManagement: React.FC = () => {
  return (
    <div className="student-management">
      <div className="header">
        <h2>📚 Course Management</h2>
        <button className="btn-primary">➕ Create Course</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search courses..."
          disabled
        />
        <button className="btn-search" disabled>
          🔍 Search
        </button>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '3rem', 
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
        <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Coming Soon</h3>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Course management functionality will be available in the next update.
        </p>
        <p style={{ 
          background: '#f1f5f9', 
          padding: '1rem', 
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#475569'
        }}>
          💡 <strong>Note:</strong> This feature will include course creation, content management,
          enrollment tracking, and analytics.
        </p>
      </div>
    </div>
  );
};

export default CourseManagement;
