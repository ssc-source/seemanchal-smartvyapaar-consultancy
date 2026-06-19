"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

import { API_BASE_URL } from "@/lib/api";

import {
  ArrowRight,
  Link,
  Globe,
  Send,
  Sparkles,
} from "lucide-react";
import { useToast } from '@/components/ui/Toast';

const roles = [
  { label: "Frontend Developer Intern", value: "Frontend" },
  { label: "Backend Developer Intern", value: "Backend" },
  { label: "Full Stack Developer", value: "Full Stack" },
  { label: "UI/UX Designer", value: "UI/UX" },
];

export default function InternshipApplication() {

  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    registrationId: "",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    college: "",
    degree: "",
    graduationYear: "",
    applyingFor: "",
    internshipType: "",
    github: "",
    linkedin: "",
    portfolio: "",
    projectsExperience: "",
    whyJoinSSC: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    // Prefill from authenticated student profile if available
    const loadProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/student/me`, { credentials: 'include' });
        const json = await res.json();
        if (res.ok && json.success && json.data && json.data.student) {
          const s = json.data.student;
          setFormData((prev) => ({
            ...prev,
            registrationId: s.registrationId || prev.registrationId,
            fullName: s.name || prev.fullName,
            email: s.email || prev.email,
            phone: s.phone || prev.phone,
          }));
          return;
        }
      } catch (e) {
        // fallback to localStorage if API fails
        if (typeof window === 'undefined') return;
        const user = window.localStorage.getItem('user');
        if (!user) return;
        try {
          const parsed = JSON.parse(user);
          setFormData((prev) => ({
            ...prev,
            registrationId: parsed.registrationId || prev.registrationId,
            fullName: parsed.name || prev.fullName,
            email: parsed.email || prev.email,
            phone: parsed.phone || prev.phone,
          }));
        } catch (error) {
          console.warn('Failed to parse user from localStorage', error);
        }
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.registrationId?.trim()) nextErrors.registrationId = 'Registration ID is required';
    if (!formData.fullName?.trim()) nextErrors.fullName = 'Full Name is required';
    if (!formData.email?.trim()) nextErrors.email = 'Email is required';
    if (!formData.phone?.trim()) nextErrors.phone = 'Phone Number is required';
    if (!formData.location?.trim()) nextErrors.location = 'Location is required';
    if (!formData.college?.trim()) nextErrors.college = 'College is required';
    if (!formData.degree?.trim()) nextErrors.degree = 'Degree is required';
    if (!formData.graduationYear?.trim()) nextErrors.graduationYear = 'Graduation Year is required';
    if (!formData.applyingFor?.trim()) nextErrors.applyingFor = 'Applying For is required';
    if (!formData.internshipType?.trim()) nextErrors.internshipType = 'Internship Type is required';
    if (!formData.projectsExperience?.trim()) nextErrors.projectsExperience = 'Projects / Experience is required';
    if (!formData.whyJoinSSC?.trim()) nextErrors.whyJoinSSC = 'Why Join SSC is required';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        registrationId: formData.registrationId,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        college: formData.college,
        degree: formData.degree,
        graduationYear: formData.graduationYear,
        applyingFor: formData.applyingFor,
        internshipType: formData.internshipType,
        github: formData.github || null,
        linkedin: formData.linkedin || null,
        portfolio: formData.portfolio || null,
        projectsExperience: formData.projectsExperience,
        whyJoinSSC: formData.whyJoinSSC,
      };

      if (process.env.NODE_ENV !== 'production') {
        console.debug('[InternshipApplication] submit payload', submitData);
      }

      const response = await fetch(`${API_BASE_URL}/api/internships/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        const rawText = await response.text();
        console.error('[InternshipApplication] Failed to parse response JSON', { status: response.status, rawText, jsonError });
        throw new Error('Invalid server response. Please check console for details.');
      }

      if (!response.ok) {
        console.error('[InternshipApplication] Server returned error', { status: response.status, result });
        const serverMessage = result.message || (result.errors && result.errors.join(', ')) || 'Failed to submit internship application';
        if (/resume/i.test(serverMessage)) {
          throw new Error('Your application could not be submitted due to outdated validation. Please contact support.');
        }
        throw new Error(serverMessage);
      }

      // show success toast and redirect to dashboard
      if (toast && toast.success) toast.success('Internship application submitted successfully');
      router.push('/dashboard');
      setSubmitted(true);

    } catch (error) {
        console.error('[InternshipApplication] submit error', error);
        setServerError(error.message || 'Failed to submit application');
        if (toast && toast.error) {
          toast.error(error.message || 'Failed to submit application');
        }
      } finally {
        setLoading(false);
      }
    };
  if (submitted) {
    return (
      <div className="rounded-4xl border border-slate-200 bg-white p-16 text-center shadow-xl">

        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <Send className="h-10 w-10 text-green-600" />
        </div>

        <h2 className="text-5xl font-bold text-slate-900 mb-6">
          Application Submitted
        </h2>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Thank you for applying to SSC.
          Our team will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[36px] border border-slate-200 bg-white shadow-2xl overflow-hidden">

      {/* TOP SECTION */}

      <div className="bg-linear-to-r from-brand-accent to-blue-700 px-10 py-12 text-white">

        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold mb-6">
          <Sparkles className="h-4 w-4" />
          Internship & Career Application
        </div>

        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
          Join The SSC Ecosystem
        </h2>

        <p className="text-blue-100 text-lg leading-relaxed max-w-3xl">
          Work on modern SaaS systems, ERP platforms, AI products,
          startup infrastructure, and real-world projects.
        </p>
      </div>

      {/* FORM */}

      <div className="p-8 md:p-12">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 mb-8">
          Resume upload is not required for this application.
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 md:p-12 space-y-10"
      >
        {serverError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {serverError}
          </div>
        ) : null}

        {/* PERSONAL */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="space-y-2">
            <input
              type="text"
              name="registrationId"
              value={formData.registrationId}
              readOnly
              placeholder="Registration ID"
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-5 py-4"
            />
            {errors.registrationId && (
              <p className="text-sm text-red-600">{errors.registrationId}</p>
            )}
          </div>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            readOnly
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            readOnly
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          />

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            readOnly
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          />

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Current Location"
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          />

        </div>

        {/* EDUCATION */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="College / University"
            required
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          />

          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            placeholder="Degree / Course"
            required
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          />

          <input
            type="text"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            placeholder="Graduation Year"
            required
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          />

          <select
            name="applyingFor"
            value={formData.applyingFor}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          >
            <option value="">Applying For</option>

            {roles.map((role, index) => (
              <option key={index} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {errors.applyingFor && (
            <p className="mt-2 text-sm text-red-600">{errors.applyingFor}</p>
          )}

        </div>

        {/* INTERNSHIP TYPE */}

        <div>
          <select
            name="internshipType"
            value={formData.internshipType}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          >
            <option value="">Select Internship Type</option>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>On-site</option>
          </select>
          {errors.internshipType && (
            <p className="mt-2 text-sm text-red-600">{errors.internshipType}</p>
          )}
        </div>

        {/* LINKS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="relative">

            <Link className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="GitHub Profile"
              className="w-full rounded-2xl border border-slate-300 pl-12 pr-5 py-4"
            />
          </div>

          <div className="relative">

            <Link className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn Profile"
              className="w-full rounded-2xl border border-slate-300 pl-12 pr-5 py-4"
            />
          </div>

        </div>

        <div className="relative">

          <Globe className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

          <input
            type="url"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleChange}
            placeholder="Portfolio Website"
            className="w-full rounded-2xl border border-slate-300 pl-12 pr-5 py-4"
          />
        </div>

        {/* EXPERIENCE */}

        <textarea
          rows={5}
            name="projectsExperience"
            value={formData.projectsExperience}
            onChange={handleChange}
            placeholder="Projects / Experience"
            required
            className="w-full rounded-2xl border border-slate-300 px-5 py-4 resize-none"
          />
          {errors.projectsExperience && (
            <p className="mt-2 text-sm text-red-600">{errors.projectsExperience}</p>
          )}

        <textarea
          rows={6}
          name="whyJoinSSC"
          value={formData.whyJoinSSC}
          onChange={handleChange}
          placeholder="Why Join SSC?"
          required
          className="w-full rounded-2xl border border-slate-300 px-5 py-4 resize-none"
        />
        {errors.whyJoinSSC && (
          <p className="mt-2 text-sm text-red-600">{errors.whyJoinSSC}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-3 rounded-2xl bg-brand-accent px-8 py-5 text-lg font-semibold text-white hover:opacity-90 transition-all"
        >
          {loading ? "Submitting..." : "Submit Application"}

          <ArrowRight className="h-5 w-5" />
        </button>

      </form>
    </div>
  );
}