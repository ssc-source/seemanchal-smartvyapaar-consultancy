import { API_BASE_URL } from './api';

export const getApiBase = () => API_BASE_URL;

const parseResponse = async (res) => {
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const message = json?.message || 'Server error';
    throw new Error(message);
  }
  return json;
};

export async function createOrder(payload) {
  console.log('[payments] createOrder payload', payload);
  const res = await fetch(`${getApiBase()}/api/payments/create-order`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await parseResponse(res);
  console.log('[payments] createOrder response', json);
  return json;
}

export async function verifyPayment(payload) {
  console.log('[payments] verifyPayment payload', payload);
  const res = await fetch(`${getApiBase()}/api/payments/verify`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await parseResponse(res);
  console.log('[payments] verifyPayment response', json);
  return json;
}
