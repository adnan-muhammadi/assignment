import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Load users from localStorage
const loadUsers = () => {
  try {
    const data = localStorage.getItem('users');
    if (data) return JSON.parse(data);
    return null;
  } catch {
    return null;
  }
};

// Save users to localStorage
const saveUsers = (users) => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch {}
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState }) => {
    // Only fetch from API if localStorage is empty
    const local = loadUsers();
    if (local && local.length > 0) return { payload: local, fromLocal: true };
    const res = await fetch(`${API_URL}?_limit=10`);
    const apiUsers = await res.json();
    saveUsers(apiUsers);
    return { payload: apiUsers, fromLocal: false };
  }
);

const initialState = {
  items: loadUsers() || [],
  status: 'idle',
  error: null,
  fromLocal: !!loadUsers(),
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      let id = action.payload.id;
      while (state.items.some(u => u.id === id)) id += Math.floor(Math.random()*1000);
      const newUser = { ...action.payload, id };
      state.items.unshift(newUser);
      saveUsers(state.items);
      state.fromLocal = true;
    },
    updateUser: (state, action) => {
      const { id, field, value } = action.payload;
      const user = state.items.find(u => u.id === id);
      if (user) user[field] = value;
      saveUsers(state.items);
      state.fromLocal = true;
    },
    deleteUser: (state, action) => {
      state.items = state.items.filter(u => u.id !== action.payload);
      saveUsers(state.items);
      state.fromLocal = true;
    },
    resetUsers: (state) => {
      state.items = [];
      saveUsers([]);
      state.fromLocal = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.payload;
        state.fromLocal = action.payload.fromLocal;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addUser, updateUser, deleteUser, resetUsers } = usersSlice.actions;
export default usersSlice.reducer;
