"use client";

import React, { useEffect, useState } from 'react';
import { createOrder, verifyPayment, getApiBase } from '@/lib/payments';
import RazorpayCheckout from '@/components/RazorpayCheckout';
import { API_BASE_URL } from '@/lib/api';

export default function AssessmentPage({ params }) {

  const quizId = params.id;
  const [quiz, setQuiz] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    fetch(`${API_BASE_URL}/api/quizzes/${quizId}`).then(r=>r.json()).then(j=>{ if(j.success) setQuiz(j.data); }).catch(()=>{});
  },[quizId]);

  const startPayment = async () => {
    setLoading(true);
    try {
      const res = await createOrder(quizId);
      if (!res || !res.success) throw new Error(res?.message || 'Failed to create order');
      // Backend returns { order, registration }
      setOrder(res.data.order);
    } catch (err) {
      alert(err.message || 'Order creation failed');
    } finally { setLoading(false); }
  };

  const handleSuccess = async (razorpayResponse) => {
    // Verify on server
    try {
      const payload = { ...razorpayResponse, quizExamId: quizId };
      const res = await verifyPayment(payload);
      if (res && res.success) {
        // Redirect to assessment start page
        window.location.href = `/assessment/${quizId}/take`;
      } else {
        alert('Payment verification failed');
      }
    } catch (err) {
      alert('Verification error');
    }
  };

  const handleError = (err) => {
    alert(err.message || 'Payment error');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>{quiz ? quiz.title : 'Assessment'}</h1>
      <p>{quiz ? quiz.description : ''}</p>
      <div style={{ marginTop: 20 }}>
        {order ? (
          <RazorpayCheckout order={order} onSuccess={handleSuccess} onError={handleError} />
        ) : (
          <button onClick={startPayment} disabled={loading} className="btn btn-primary">{loading ? 'Creating order...' : 'Buy Assessment for ₹199'}</button>
        )}
      </div>
    </div>
  );
}
