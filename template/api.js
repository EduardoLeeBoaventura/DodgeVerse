const API_URL = 'http://localhost:3001/api';

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

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password })
  });
  return res.json();
};