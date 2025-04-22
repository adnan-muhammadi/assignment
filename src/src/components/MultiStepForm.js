import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../usersSlice';

function StepOne({ next, data, setData, error }) {
  const [value, setValue] = useState(data.name || '');
  return (
    <div>
      <h2>Step 1</h2>
      <input value={value} onChange={e => setValue(e.target.value)} placeholder="Name" />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="button" onClick={() => next(value)}>Next</button>
    </div>
  );
}
function StepTwo({ next, prev, data, setData, error }) {
  const [value, setValue] = useState(data.email || '');
  return (
    <div>
      <h2>Step 2</h2>
      <input value={value} onChange={e => setValue(e.target.value)} placeholder="Email" />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="button" onClick={prev}>Back</button>
      <button type="button" onClick={() => next(value)}>Next</button>
    </div>
  );
}
function StepThree({ prev, data }) {
  return (
    <div>
      <h2>Step 3</h2>
      <p>Name: {data.name}</p>
      <p>Email: {data.email}</p>
      <button type="button" onClick={prev}>Back</button>
      <button type="submit">Submit</button>
    </div>
  );
}

export default function MultiStepForm() {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const nextStep = (value) => {
    if (step === 0) {
      if (!value.trim()) { setError('Name required'); return; }
      setData(d => ({ ...d, name: value }));
      setError('');
      setStep(1);
    } else if (step === 1) {
      if (!value.trim() || !/^\S+@\S+\.\S+$/.test(value)) { setError('Valid email required'); return; }
      setData(d => ({ ...d, email: value }));
      setError('');
      setStep(2);
    }
  };
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = e => {
    e.preventDefault();
    if (!data.name || !data.email) {
      setError('All fields required');
      return;
    }
    // Persist new user to localStorage as well as Redux
    const newUser = { id: Date.now(), ...data };
    dispatch(addUser(newUser));
    localStorage.setItem('users', JSON.stringify([...JSON.parse(localStorage.getItem('users') || '[]'), newUser]));
    setSubmitted(true);
  };
  if (submitted) return <div>Form submitted! Thank you.</div>;
  return (
    <form onSubmit={handleSubmit} className="app-container">
      {step === 0 && <StepOne next={nextStep} data={data} setData={setData} error={error} />}
      {step === 1 && <StepTwo next={nextStep} prev={prevStep} data={data} setData={setData} error={error} />}
      {step === 2 && <StepThree prev={prevStep} data={data} />}
    </form>
  );
}
