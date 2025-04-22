import React from 'react';

export default function LoaderFooter({ loading }) {
  if (!loading) return null;
  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <span>Loading more users...</span>
    </div>
  );
}
