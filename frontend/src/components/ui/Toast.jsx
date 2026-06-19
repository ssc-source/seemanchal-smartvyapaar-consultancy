"use client";

import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message, timeout = 4000) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, timeout);
  };

  const api = {
    success: (msg, t) => addToast('success', msg, t),
    error: (msg, t) => addToast('error', msg, t || 6000),
    warn: (msg, t) => addToast('warn', msg, t),
    info: (msg, t) => addToast('info', msg, t),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <div key={t.id} className="max-w-sm w-full">
            <ToastItem type={t.type} message={t.message} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    console.warn('useToast must be used within a ToastProvider');
    return { success: () => {}, error: () => {}, warn: () => {}, info: () => {} };
  }
  return ctx;
};

function ToastItem({ type, message }) {
  const base = 'flex items-start gap-3 p-3 rounded-lg shadow-md border';
  const style = {
    success: 'bg-white border-green-100',
    error: 'bg-white border-red-100',
    warn: 'bg-white border-yellow-100',
    info: 'bg-white border-slate-100',
  }[type];

  const color = {
    success: 'text-green-600',
    error: 'text-red-600',
    warn: 'text-yellow-600',
    info: 'text-slate-700',
  }[type];

  return (
    <div className={`${base} ${style}`} role="status" aria-live="polite">
      <div className={`flex-shrink-0 ${color}`}>
        {type === 'success' && (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {type === 'error' && (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {type === 'warn' && (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        )}
        {type === 'info' && (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 18a6 6 0 100-12 6 6 0 000 12z" />
          </svg>
        )}
      </div>
      <div className="text-sm text-slate-700">{message}</div>
    </div>
  );
}
