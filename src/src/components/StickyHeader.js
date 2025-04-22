import React from 'react';

export default function StickyHeader() {
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      background: '#fff',
      zIndex: 1000,
      borderBottom: '1px solid #ccc',
      padding: '1rem',
      fontWeight: 'bold',
      fontSize: '1.2rem',
    }}>
      User List
    </div>
  );
}
