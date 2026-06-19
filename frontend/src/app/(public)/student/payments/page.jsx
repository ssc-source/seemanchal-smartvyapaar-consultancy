"use client";

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';

export default function StudentPaymentsPage(){

  const [payments, setPayments] = useState([]);

  useEffect(()=>{
    fetch(`${API_BASE_URL}/api/payments/student`, { credentials: 'include' }).then(r=>r.json()).then(j=>{ if(j.success) setPayments(j.data); }).catch(()=>{});
  },[]);

  return (
    <div style={{ padding: 20 }}>
      <h1>My Payments</h1>
      <table style={{ width: '100%' }}>
        <thead><tr><th>ID</th><th>Quiz</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}><td>{p.id}</td><td>{p.quizExamId}</td><td>{p.amount}</td><td>{p.paymentStatus} {p.paymentStatus==='paid' && <a style={{ marginLeft: 8 }} href={`/api/payments/${p.id}/invoice`}>Invoice</a>}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
