const API_URL = 'http://localhost:3001';

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

export const checkSession = async () => {
  const res = await fetch('http://localhost:3001/session', {
    method: 'GET',
    credentials: 'include',
  });
  if(res.status === 401) return false;
  return res.json();
};

export const logout = async () => {
  const res = await fetch('http://localhost:3001/players/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Erro ao deslogar');
  const data = await res.json();
  return data;
};

export const login = async (email, password) => {
  const res = await fetch('http://localhost:3001/players/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};