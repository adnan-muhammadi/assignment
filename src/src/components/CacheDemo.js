import React, { useState, useEffect } from 'react';

// Simple cache using localStorage
const fetchWithCache = async (url) => {
  const cached = localStorage.getItem(url);
  if (cached) {
    return JSON.parse(cached);
  }
  const res = await fetch(url);
  const data = await res.json();
  localStorage.setItem(url, JSON.stringify(data));
  return data;
};

export default function CacheDemo() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchWithCache('https://jsonplaceholder.typicode.com/users')
      .then(data => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', border: '1px solid #eee', borderRadius: 8, padding: 20 }}>
      <h2>Cached User List</h2>
      {loading ? <div>Loading...</div> : (
        <ul>
          {users.map(user => <li key={user.id}>{user.name}</li>)}
        </ul>
      )}
      <button onClick={() => { localStorage.clear(); window.location.reload(); }}>Clear Cache</button>
    </div>
  );
}
