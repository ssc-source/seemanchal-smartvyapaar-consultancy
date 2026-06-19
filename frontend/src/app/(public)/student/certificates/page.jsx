"use client";

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';

export default function StudentCertificatesPage(){

  const [certs, setCerts] = useState([]);
  useEffect(()=>{
    fetch(`${API_BASE_URL}/api/certificates/student`, { credentials: 'include' }).then(r=>r.json()).then(j=>{ if(j.success) setCerts(j.data); }).catch(()=>{});
  },[]);
  return (
    <div style={{ padding: 20 }}>
      <h1>My Certificates</h1>
      <ul>
        {certs.map(c => (<li key={c.id}>{c.certificateId} - {c.certificateType} - Issued: {new Date(c.issuedAt).toLocaleDateString()}</li>))}
      </ul>
    </div>
  );
}
