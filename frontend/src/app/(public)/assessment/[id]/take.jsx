"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getApiBase } from '@/lib/payments';

export default function TakeAssessment({ params }){
  const quizId = params.id;
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const start = async () => {
    setLoading(true);
    try {
      const payload = { studentId: null };
      console.log('Quiz attempt start payload', payload);
      const res = await fetch(`${getApiBase()}/api/quizzes/${quizId}/attempts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (j.success) {
        setResult(j.data);
      } else {
        alert(j.message || 'Failed to start attempt');
      }
    } catch (err) {
      alert('Network error');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Start Assessment</h1>
      {!result ? (
        <div>
          <p>Click start to begin the assessment.</p>
          <button onClick={start} disabled={loading} className="btn btn-primary">{loading ? 'Starting...' : 'Start Assessment'}</button>
        </div>
      ) : (
        <div>
          <h2>Attempt Started</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
          <p>Proceed to the assessment interface to answer questions.</p>
        </div>
      )}
    </div>
  );
}
