'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';

export default function AdminManualAddPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    college: '',
    course: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.warn('Name and email are required');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/users/add-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setResult(data);
        toast.success(`User Created — Registration ID: ${data.registrationId}`);
        setFormData({ name: '', email: '', phone: '', dob: '', college: '', course: '' });
      } else {
        toast.error('Error: ' + (data.message || data.error || 'Unknown'));
      }
    } catch (error) {
      toast.error('Error: ' + (error.message || error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Add New User Manually</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            pattern="[0-9]{10}"
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">College</label>
          <input
            type="text"
            value={formData.college}
            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Course</label>
          <input
            type="text"
            value={formData.course}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded">
            {submitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded bg-green-50">
          <h2 className="font-semibold">✅ User Created Successfully!</h2>
          <p><strong>User ID:</strong> {result.userId}</p>
          <p><strong>Registration ID:</strong> <code>{result.registrationId}</code></p>
          <p><strong>Email:</strong> {result.email || formData.email}</p>
          <p>Student will receive an email with login credentials.</p>
        </div>
      )}
    </div>
  );
}
