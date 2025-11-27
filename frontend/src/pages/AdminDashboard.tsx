import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentManagement from '../components/admin/StudentManagement';
import TeacherManagement from '../components/admin/TeacherManagement';
import CourseManagement from '../components/admin/CourseManagement';
import AdminOverview from '../components/admin/AdminOverview';
import '../styles/AdminDashboard.css';

type TabType = 'overview' | 'students' | 'teachers' | 'courses';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/stats/overview`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <div className="navbar-brand">
          <div className="logo">👨‍💼</div>
          <h1>Admin Panel</h1>
        </div>
        <div className="navbar-menu">
          <div className="user-info">
            <span className="admin-badge">ADMIN</span>
            <span>{user?.full_name}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logout
          </button>
        </div>
      </nav>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="sidebar-menu">
            <button
              className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="icon">📊</span>
              <span>Overview</span>
            </button>
            <button
              className={`menu-item ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <span className="icon">👨‍🎓</span>
              <span>Students</span>
              {stats && <span className="badge">{stats.users.students}</span>}
            </button>
            <button
              className={`menu-item ${activeTab === 'teachers' ? 'active' : ''}`}
              onClick={() => setActiveTab('teachers')}
            >
              <span className="icon">👨‍🏫</span>
              <span>Teachers</span>
              {stats && <span className="badge">{stats.users.teachers}</span>}
            </button>
            <button
              className={`menu-item ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <span className="icon">📚</span>
              <span>Courses</span>
              {stats && <span className="badge">{stats.courses.total}</span>}
            </button>
          </div>
        </aside>

        <main className="admin-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <AdminOverview stats={stats} />}
              {activeTab === 'students' && <StudentManagement />}
              {activeTab === 'teachers' && <TeacherManagement />}
              {activeTab === 'courses' && <CourseManagement />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
