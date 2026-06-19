"use client";

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';

export default function StudentAssessmentsPage(){

  const [quizzes, setQuizzes] = useState([]);
  useEffect(()=>{
    fetch(`${API_BASE_URL}/api/quizzes`, { credentials: 'include' }).then(r=>r.json()).then(j=>{ if(j.success) setQuizzes(j.data); }).catch(()=>{});
  },[]);
  return (
    <div style={{ padding: 20 }}>
      <h1>Assessments</h1>
      <ul>
        {quizzes.map(q=> (<li key={q.id}>{q.title} - Pass: {q.passMarks}%</li>))}
      </ul>
    </div>
  );
}
