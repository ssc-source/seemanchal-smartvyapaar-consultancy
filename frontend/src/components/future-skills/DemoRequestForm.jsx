'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function DemoRequestForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    schoolName: '',
    principalName: '',
    designation: '',
    email: '',
    phone: '',
    boardType: 'cbse',
    studentStrength: '',
    classesCovered: [],
    interestedPrograms: [],
    city: '',
    state: '',
    message: '',
  });

  const classOptions = [
    '6-8', '9-10', '11-12',
  ];

  const programOptions = [
    'Future Skills Program',
    'Workshops & Events',
    'School Partnership',
    'Career Discovery Support',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClassesChange = (classRange) => {
    setFormData(prev => ({
      ...prev,
      classesCovered: prev.classesCovered.includes(classRange)
        ? prev.classesCovered.filter(c => c !== classRange)
        : [...prev.classesCovered, classRange]
    }));
  };

  const handleProgramsChange = (program) => {
    setFormData(prev => ({
      ...prev,
      interestedPrograms: prev.interestedPrograms.includes(program)
        ? prev.interestedPrograms.filter((item) => item !== program)
        : [...prev.interestedPrograms, program]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.submitFutureSkillsInquiry(formData);
      setSuccess(true);
      setFormData({
        schoolName: '',
        principalName: '',
        designation: '',
        email: '',
        phone: '',
        boardType: 'cbse',
        studentStrength: '',
        classesCovered: [],
        interestedPrograms: [],
        city: '',
        state: '',
        message: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* School Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">School Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            School Name *
          </label>
          <input
            type="text"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter school name"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Principal Name *
            </label>
            <input
              type="text"
              name="principalName"
              value={formData.principalName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter principal's name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Principal, Director"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>
        </div>
      </div>

      {/* School Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">School Details</h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Board Type *
            </label>
            <select
              name="boardType"
              value={formData.boardType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="state_board">State Board</option>
              <option value="cbse">CBSE</option>
              <option value="icse">ICSE</option>
              <option value="igcse">IGCSE</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Student Strength
            </label>
            <input
              type="number"
              name="studentStrength"
              value={formData.studentStrength}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Total number of students"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Classes You Want to Cover
          </label>
          <div className="flex flex-wrap gap-4">
            {classOptions.map(classRange => (
              <label key={classRange} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.classesCovered.includes(classRange)}
                  onChange={() => handleClassesChange(classRange)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-slate-700">Classes {classRange}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Interested Programs
          </label>
          <div className="flex flex-wrap gap-4">
            {programOptions.map((program) => (
              <label key={program} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.interestedPrograms.includes(program)}
                  onChange={() => handleProgramsChange(program)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-slate-700">{program}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Location</h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              State *
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter state"
            />
          </div>
        </div>
      </div>

      {/* Additional Message */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Additional Information
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Tell us about your school and program interests..."
        />
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-green-700 font-semibold">Thank you for your interest!</p>
            <p className="text-green-600 text-sm">Our team will contact you within 24 hours.</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        {loading && <Loader className="h-5 w-5 animate-spin" />}
        {loading ? 'Submitting...' : 'Request Demo'}
      </button>
    </form>
  );
}
