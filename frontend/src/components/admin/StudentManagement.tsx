import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PasswordResetModal from './PasswordResetModal';
import AddUserModal from './AddUserModal';
import '../../styles/StudentManagement.css';

interface Student {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  profile_completion: number;
  created_at: string;
}

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users?role=student&limit=100`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchStudents();
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users?role=student&search=${search}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setStudents(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleResetPassword = (student: Student) => {
    setSelectedStudent(student);
    setShowPasswordReset(true);
  };

  const handleDelete = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${studentId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      fetchStudents();
      alert('Student deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete student');
    }
  };

  return (
    <div className="student-management">
      <div className="header">
        <h2>👨‍🎓 Student Management</h2>
        <button className="btn-primary" onClick={() => setShowAddStudent(true)}>➕ Add Student</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} className="btn-search">
          🔍 Search
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
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
              {students.map((student) => (
                <tr key={student.id}>
                  <td><code>{student.student_id}</code></td>
                  <td><strong>{student.full_name}</strong></td>
                  <td>{student.email}</td>
                  <td>{student.phone || '-'}</td>
                  <td>{student.country || '-'}</td>
                  <td>
                    <div className="progress-bar-mini">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${student.profile_completion}%` }}
                      />
                      <span>{student.profile_completion}%</span>
                    </div>
                  </td>
                  <td>{new Date(student.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon view" title="View">👁️</button>
                      <button className="btn-icon edit" title="Edit">✏️</button>
                      <button 
                        className="btn-icon reset"
                        onClick={() => handleResetPassword(student)}
                        title="Reset Password"
                      >
                        🔐
                      </button>
                      <button 
                        className="btn-icon delete" 
                        onClick={() => handleDelete(student.id)}
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
      )}

      {showPasswordReset && selectedStudent && (
        <PasswordResetModal
          user={selectedStudent}
          onClose={() => setShowPasswordReset(false)}
          onSuccess={() => {
            console.log('Password reset successful');
          }}
        />
      )}

      {showAddStudent && (
        <AddUserModal
          role="student"
          onClose={() => setShowAddStudent(false)}
          onSuccess={fetchStudents}
        />
      )}
    </div>
  );
};

export default StudentManagement;
