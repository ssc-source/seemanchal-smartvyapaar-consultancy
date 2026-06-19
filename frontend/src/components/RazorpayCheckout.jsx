"use client";

import React, { useEffect, useState, useRef } from 'react';

const loadRazorpayScript = () => new Promise((resolve, reject) => {
  if (typeof window === 'undefined') return reject(new Error('Window not available'));
  if (window.Razorpay) {
    console.debug('[RazorpayCheckout] Razorpay script already loaded');
    return resolve(true);
  }

  const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
  if (existingScript) {
    existingScript.addEventListener('load', () => resolve(true));
    existingScript.addEventListener('error', () => reject(new Error('Razorpay script load failed')));
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.onload = () => {
    console.debug('[RazorpayCheckout] Razorpay script loaded');
    resolve(true);
  };
  script.onerror = () => {
    console.error('[RazorpayCheckout] Razorpay script load failed');
    reject(new Error('Razorpay script load failed'));
  };
  document.body.appendChild(script);
});

export default function RazorpayCheckout({ order, onSuccess, onError, onOpen, onDismiss, autoOpen = false }) {
  const [loadingScript, setLoadingScript] = useState(false);
  const checkoutRef = useRef(null);

  const open = async () => {
    if (!order) {
      const err = new Error('Missing order');
      console.error('[RazorpayCheckout] open failed', err);
      return onError && onError(err);
    }

    try {
      setLoadingScript(true);
      console.log('[RazorpayCheckout] loading Razorpay script');
      await loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error('Razorpay not available after script load');
      }

      const { id, amount, currency, key, name, description, prefill, notes } = order;
      if (!key) throw new Error('Razorpay key missing');
      if (!id) throw new Error('Razorpay order id missing');
      if (amount == null) throw new Error('Razorpay amount missing');

      const options = {
        key,
        amount,
        currency: currency || 'INR',
        name: name || 'SSC Assessment',
        description: description || 'Assessment purchase',
        order_id: id,
        handler: function (response) {
          console.log('[RazorpayCheckout] onSuccess', response);
          onSuccess && onSuccess(response);
        },
        prefill: prefill || {},
        notes: notes || {},
        theme: { color: '#264653' },
      };

      console.log('[RazorpayCheckout] opening checkout', {
        orderId: options.order_id,
        amount: options.amount,
        currency: options.currency,
        hasKey: !!options.key,
      });

      const rzp = new window.Razorpay(options);
      checkoutRef.current = rzp;

      if (typeof onOpen === 'function') {
        try { onOpen(); } catch (callbackError) {
          console.warn('[RazorpayCheckout] onOpen callback failed', callbackError);
        }
      }

      rzp.on('payment.failed', (response) => {
        console.error('[RazorpayCheckout] payment.failed', response);
        onError && onError(new Error(response.error?.description || 'Payment failed'), response);
      });

      if (rzp.modal) {
        rzp.modal.ondismiss = function () {
          console.warn('[RazorpayCheckout] modal dismissed');
          onDismiss && onDismiss();
        };
      }

      rzp.open();
    } catch (err) {
      console.error('[RazorpayCheckout] open error', err);
      onError && onError(err);
    } finally {
      setLoadingScript(false);
    }
  };

  useEffect(() => {
    if (autoOpen && order) {
      open();
    }
  }, [autoOpen, order]);

  return (
    <button
      type="button"
      onClick={open}
      disabled={!order || loadingScript}
      className="btn btn-primary"
    >
      {loadingScript ? 'Preparing payment...' : `Pay ₹${order ? (order.amount / 100).toFixed(2) : '0.00'}`}
    </button>
  );
}
