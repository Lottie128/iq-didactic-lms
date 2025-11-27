import React, { useState } from 'react';

interface PasswordResetModalProps {
  user: {
    id: string;
    full_name: string;
    email: string;
    student_id: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ 
  user, 
  onClose, 
  onSuccess 
}) => {
  const [mode, setMode] = useState<'manual' | 'generate'>('generate');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGeneratePassword = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${user.id}/generate-password`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate password');
      }

      const data = await response.json();
      setGeneratedPassword(data.temporary_password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to generate password');
    } finally {
      setLoading(false);
    }
  };

  const handleManualReset = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${user.id}/reset-password?new_password=${encodeURIComponent(newPassword)}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      alert('Password reset successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content password-reset-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3>🔐 Reset Password</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9375rem', color: '#475569' }}>
              <strong>Student:</strong> {user.full_name}
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9375rem', color: '#475569' }}>
              <strong>ID:</strong> {user.student_id}
            </p>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9375rem', color: '#475569' }}>
              <strong>Email:</strong> {user.email}
            </p>
          </div>

          {!generatedPassword ? (
            <>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                  style={{ flex: 1, padding: '0.75rem', border: mode === 'generate' ? '2px solid transparent' : '2px solid #e2e8f0', background: mode === 'generate' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'white', color: mode === 'generate' ? 'white' : 'inherit', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                  onClick={() => setMode('generate')}
                >
                  🎲 Generate Random
                </button>
                <button
                  style={{ flex: 1, padding: '0.75rem', border: mode === 'manual' ? '2px solid transparent' : '2px solid #e2e8f0', background: mode === 'manual' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'white', color: mode === 'manual' ? 'white' : 'inherit', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                  onClick={() => setMode('manual')}
                >
                  ✏️ Set Manual
                </button>
              </div>

              {mode === 'generate' ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                    A secure random password will be generated automatically.
                  </p>
                  <button
                    style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '1rem' }}
                    onClick={handleGeneratePassword}
                    disabled={loading}
                  >
                    {loading ? '⏳ Generating...' : '🎲 Generate Password'}
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={loading}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9375rem' }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569' }}>Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9375rem' }}
                    />
                  </div>
                  <button
                    style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '1rem' }}
                    onClick={handleManualReset}
                    disabled={loading}
                  >
                    {loading ? '⏳ Resetting...' : '🔐 Reset Password'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h4 style={{ margin: '0 0 1.5rem', color: '#1e293b' }}>Password Generated Successfully!</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <code style={{ flex: 1, fontSize: '1.125rem', fontWeight: '600', color: '#667eea', letterSpacing: '1px' }}>{generatedPassword}</code>
                <button
                  style={{ padding: '0.5rem 1rem', background: copied ? '#4ade80' : 'white', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                  onClick={copyToClipboard}
                  disabled={copied}
                >
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
              <p style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #f59e0b', fontSize: '0.875rem', color: '#92400e', textAlign: 'left' }}>
                ⚠️ Make sure to share this password securely with the student. They should change it after first login.
              </p>
            </div>
          )}

          {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem', fontSize: '0.875rem' }}>{error}</div>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0' }}>
          <button style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }} onClick={onClose}>
            {generatedPassword ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;
