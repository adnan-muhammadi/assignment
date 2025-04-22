import React, { useState } from 'react';

export default function ConditionalRender() {
  const [show, setShow] = useState(false);
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', border: '1px solid #eee', borderRadius: 8, padding: 20 }}>
      <button onClick={() => setShow(s => !s)}>
        {show ? 'Hide' : 'Show'} Details
      </button>
      {show && <div style={{ marginTop: 16 }}>This section is conditionally rendered!</div>}
    </div>
  );
}
