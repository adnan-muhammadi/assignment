import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser, updateUser, addUser } from '../usersSlice';
import StickyHeader from './StickyHeader';
import LoaderFooter from './LoaderFooter';

function EditUserRow({ user, onSave, onCancel }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  return (
    <li className="card">
      <div style={{ flex: 1 }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" style={{ marginBottom: 6 }} />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      </div>
      <div>
        <button onClick={() => onSave({ ...user, name, email })}>Save</button>
        <button onClick={onCancel} style={{ background: '#e0e7ff', color: '#312e81', marginLeft: 6 }}>Cancel</button>
      </div>
    </li>
  );
}

function AddUserRow({ onAdd }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const handleAdd = () => {
    if (!name.trim() || !email.trim()) {
      setError('Name and Email required');
      return;
    }
    setError('');
    onAdd({ id: Date.now(), name, email });
    setName('');
    setEmail('');
  };
  return (
    <li className="card" style={{ background: '#eef2ff', marginTop: 0 }}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={handleAdd}>Add</button>
      {error && <span style={{ color: 'red', marginLeft: 8 }}>{error}</span>}
    </li>
  );
}

export default function UserList() {
  const dispatch = useDispatch();
  const { items, status, hasMore, page } = useSelector(state => state.users);
  const loaderRef = useRef();
  const [editId, setEditId] = useState(null);

  // Infinite scroll
  const handleScroll = useCallback(() => {
    if (!hasMore || status === 'loading') return;
    if (loaderRef.current) {
      const rect = loaderRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        dispatch(fetchUsers(page));
      }
    }
  }, [dispatch, hasMore, status, page]);

  useEffect(() => {
    // Only fetch from API if localStorage is empty
    if (!localStorage.getItem('users') || JSON.parse(localStorage.getItem('users')).length === 0) {
      dispatch(fetchUsers(1));
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line
  }, [dispatch]);

  const handleSave = (user) => {
    dispatch(updateUser({ id: user.id, field: 'name', value: user.name }));
    dispatch(updateUser({ id: user.id, field: 'email', value: user.email }));
    setEditId(null);
  };

  const handleAdd = (user) => {
    dispatch(addUser(user));
  };

  return (
    <div className="app-container">
      <div className="sticky-header">User List</div>
      <ul>
        <AddUserRow onAdd={handleAdd} />
        {items.map(user => (
          editId === user.id ? (
            <EditUserRow key={user.id} user={user} onSave={handleSave} onCancel={() => setEditId(null)} />
          ) : (
            <li key={user.id} className="card">
              <span style={{ fontWeight: 500 }}>
                {user.name} <span style={{ color: '#6366f1', fontSize: 13, marginLeft: 4 }}>({user.email})</span>
              </span>
              <span>
                <button style={{ marginRight: 8 }} onClick={() => setEditId(user.id)}>Edit</button>
                <span style={{ color: 'red', cursor: 'pointer', fontSize: 20, verticalAlign: 'middle' }} onClick={() => dispatch(deleteUser(user.id))} title="Delete">🗑️</span>
              </span>
            </li>
          )
        ))}
      </ul>
      <div ref={loaderRef} />
      <div className="loader-footer">
        <LoaderFooter loading={status === 'loading'} />
      </div>
    </div>
  );
}
