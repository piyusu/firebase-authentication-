import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { createApiClient } from './api.js'

function Dashboard() {
  const { user, idToken, loading, loginWithGoogle, logout } = useAuth();
  const api = useMemo(() => createApiClient(async () => idToken), [idToken]);
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get role from Firebase custom claims or default to 'user'
  const role = profile?.firebase?.role || 'user';

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setTasks([]);
      return;
    }
    
    loadData();
  }, [user, api]);

  async function loadData() {
    try {
      setError('');
      const [me, list] = await Promise.all([
        api.getMe(),
        api.listTasks()
      ]);
      setProfile(me);
      setTasks(list);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleCreateTask(e) {
    e.preventDefault();
    if (!title.trim()) return;
    
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    
    try {
      const newTask = await api.createTask({ title: title.trim(), description: description.trim() });
      setTasks([newTask, ...tasks]);
      setTitle('');
      setDescription('');
      setSuccess('Task created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleComplete(task) {
    try {
      const updatedTask = await api.updateTask(task._id, { completed: !task.completed });
      setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
    } catch (e) {
      setError(e.message);
    }
  }

  async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
      setSuccess('Task deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Task Manager</h1>
          <p>Sign in to manage your tasks</p>
          <button className="login-btn" onClick={loginWithGoogle}>
            <svg viewBox="0 0 24 24" className="google-icon">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <div className="avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="user-details">
              <h2>Welcome, {user.displayName || user.email}</h2>
              <span className={`role-badge ${role}`}>
                {role === 'admin' ? '👑 Admin' : '👤 User'}
              </span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Messages */}
        {error && (
          <div className="message error">
            <span>❌ {error}</span>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}
        {success && (
          <div className="message success">
            <span>✅ {success}</span>
            <button onClick={() => setSuccess('')}>×</button>
          </div>
        )}

        {/* Create Task Form */}
        <div className="create-task-section">
          <h3>Create New Task</h3>
          <form onSubmit={handleCreateTask} className="task-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
                className="task-input"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className="task-input"
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !title.trim()}
                className="create-btn"
              >
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>

        {/* Tasks List */}
        <div className="tasks-section">
          <div className="section-header">
            <h3>Your Tasks ({tasks.length})</h3>
            {role === 'admin' && (
              <span className="admin-note">👑 You can see and manage all tasks</span>
            )}
          </div>
          
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Create your first task above!</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map(task => (
                <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                  <div className="task-header">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task)}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <h4 className="task-title">{task.title}</h4>
                    {role === 'admin' && (
                      <button 
                        onClick={() => deleteTask(task._id)}
                        className="delete-btn"
                        title="Delete task"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  <div className="task-meta">
                    <span className="task-date">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                    {task.ownerUid !== user.uid && role === 'admin' && (
                      <span className="owner-note">Owner: {task.ownerUid.slice(0, 8)}...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Role Assignment */}
        {role === 'admin' && (
          <AdminRoleAssigner api={api} />
        )}
      </main>
    </div>
  );
}

function AdminRoleAssigner({ api }) {
  const [targetUid, setTargetUid] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!targetUid.trim()) return;
    
    setMessage('');
    setError('');
    setIsSubmitting(true);
    
    try {
      const res = await api.assignRole(targetUid.trim(), role);
      setMessage(`✅ Successfully assigned ${role} role to ${res.user?.uid || targetUid}`);
      setTargetUid('');
      setTimeout(() => setMessage(''), 5000);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-section">
      <h3>👑 Admin Controls</h3>
      <div className="admin-card">
        <h4>Assign User Role</h4>
        <form onSubmit={submit} className="role-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Firebase UID"
              value={targetUid}
              onChange={(e) => setTargetUid(e.target.value)}
              required
              disabled={isSubmitting}
              className="uid-input"
            />
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              disabled={isSubmitting}
              className="role-select"
            >
              <option value="user">👤 User</option>
              <option value="admin">👑 Admin</option>
            </select>
            <button 
              type="submit" 
              disabled={isSubmitting || !targetUid.trim()}
              className="assign-btn"
            >
              {isSubmitting ? 'Assigning...' : 'Assign Role'}
            </button>
          </div>
        </form>
        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  )
}

export default App
