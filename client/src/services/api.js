function readCookie(name) { return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=').slice(1).join(''); }

export async function request(path, options = {}) {
  const method = options.method || 'GET';
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers };
  if (!['GET', 'HEAD'].includes(method)) headers['X-CSRF-Token'] = decodeURIComponent(readCookie('dz_csrf') || '');
  let response;
  try { response = await fetch(`/api${path}`, { credentials: 'include', ...options, method, headers }); }
  catch { throw new Error('Unable to reach the server. Check that the API is running.'); }
  const rawResponse = await response.text();
  let data;
  try { data = rawResponse ? JSON.parse(rawResponse) : {}; }
  catch {
    data = { message: response.status >= 500
      ? 'The API server is unavailable. Confirm the server is running and MongoDB Atlas allows this computer to connect.'
      : 'The server returned an unreadable response.' };
  }
  if (!response.ok) { const error = new Error(data.message || 'Request failed.'); error.status = response.status; error.details = data.errors; throw error; }
  return data;
}

export const authApi = { register: body => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }), login: body => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }), logout: () => request('/auth/logout', { method: 'POST' }), me: () => request('/auth/me') };
export const assignmentsApi = { list: params => request(`/assignments?${new URLSearchParams(params).toString()}`), get: id => request(`/assignments/${id}`), create: body => request('/assignments', { method: 'POST', body: JSON.stringify(body) }), update: (id, body) => request(`/assignments/${id}`, { method: 'PATCH', body: JSON.stringify(body) }), remove: id => request(`/assignments/${id}`, { method: 'DELETE' }) };
export const dashboardApi = { stats: () => request('/dashboard/stats') };
