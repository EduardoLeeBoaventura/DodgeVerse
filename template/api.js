const API_URL = 'http://localhost:3001';

async function wrapFetch(url, options = {}) {
  const res = await fetch(url, options);
  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
}

export const checkSession = async () => {
  return await wrapFetch(`${API_URL}/session`, {
    method: 'GET',
    credentials: 'include',
  });
};

export const login = async (email, password) => {
  return await wrapFetch(`${API_URL}/players/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (name, email, password) => {
  return await wrapFetch(`${API_URL}/players/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password }),
  });
};

export const logout = async () => {
  return await wrapFetch(`${API_URL}/players/logout`, {
    method: 'POST',
    credentials: 'include',
  });
};

// outros endpoints (getScores, postScore) podem permanecer como estavam
export const getScores = async () => {
  const res = await fetch(`${API_URL}/scores`);
  return res.json();
};

export const postScore = async (name, points) => {
  const res = await fetch(`${API_URL}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, points }),
  });
  return res.json();
};
