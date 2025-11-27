import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddUserModal from './AddUserModal';
import '../../styles/StudentManagement.css';

interface Teacher {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  profile_completion: number;
  created_at: string;
}

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddTeacher, setShowAddTeacher] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users?role=teacher&limit=100`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setTeachers(response.data);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchTeachers();
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users?role=teacher&search=${search}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setTeachers(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleDelete = async (teacherId: string) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${teacherId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      fetchTeachers();
      alert('Teacher deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete teacher');
    }
  };

  return (
    <div className="student-management">
      <div className="header">
        <h2>👨‍🏫 Teacher Management</h2>
        <button className="btn-primary" onClick={() => setShowAddTeacher(true)}>
          ➕ Add Teacher
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search teachers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} className="btn-search">
          🔍 Search
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading teachers...</div>
      ) : teachers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👨‍🏫</div>
          <h3>No Teachers Yet</h3>
          <p>
            Click the "Add Teacher" button above to create your first teacher account.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Teacher ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Profile</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td><code>{teacher.student_id}</code></td>
                    <td><strong>{teacher.full_name}</strong></td>
                    <td>{teacher.email}</td>
                    <td>{teacher.phone || '-'}</td>
                    <td>{teacher.country || '-'}</td>
                    <td>
                      <div className="progress-bar-mini">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${teacher.profile_completion}%` }}
                        />
                        <span>{teacher.profile_completion}%</span>
                      </div>
                    </td>
                    <td>{new Date(teacher.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon view" title="View">👁️</button>
                        <button className="btn-icon edit" title="Edit">✏️</button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleDelete(teacher.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddTeacher && (
        <AddUserModal
          role="teacher"
          onClose={() => setShowAddTeacher(false)}
          onSuccess={fetchTeachers}
        />
      )}
    </div>
  );
};

export default TeacherManagement;