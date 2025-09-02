export function createApiClient(getToken) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

  async function request(path, options = {}) {
    const token = await getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };
    const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
    if (!res.ok) {
      let body;
      try { body = await res.json(); } catch (_) { body = {}; }
      const message = body.error || res.statusText;
      throw new Error(message);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  return {
    getMe: () => request('/users/me'),
    assignRole: (uid, role) => request('/users/assign-role', { method: 'POST', body: JSON.stringify({ uid, role }) }),
    listTasks: () => request('/tasks'),
    createTask: (payload) => request('/tasks', { method: 'POST', body: JSON.stringify(payload) }),
    updateTask: (id, payload) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  };
}


