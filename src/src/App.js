import React, { Suspense, lazy } from 'react';
import { Provider, useSelector } from 'react-redux';
import store from './store';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';

const UserList = lazy(() => import('./components/UserList'));
const MultiStepForm = lazy(() => import('./components/MultiStepForm'));

function GlobalLoader() {
  const status = useSelector(state => state.users.status);
  if (status !== 'loading') return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(255,255,255,0.7)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <ClipLoader color="#6366f1" size={80} />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <GlobalLoader />
        <nav style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #eee' }}>
          <Link to="/">Users</Link>
          <Link to="/form">Multi-Step Form</Link>
        </nav>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/form" element={<MultiStepForm />} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;
