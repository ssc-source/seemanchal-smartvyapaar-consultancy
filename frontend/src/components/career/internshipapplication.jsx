"use client";

import { useState } from "react";

import { api } from "@/lib/api";

import {
  ArrowRight,
  Link,
  Globe,
  Send,
  Sparkles,
} from "lucide-react";

const roles = [
  "Frontend Developer Intern",
  "Backend Developer Intern",
  "Full Stack Developer",
  "UI/UX Designer",
];

export default function InternshipApplication() {

  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    college: "",
    degree: "",
    graduationYear: "",
    role: "",
    internshipType: "",
    github: "",
    linkedin: "",
    portfolio: "",
    experience: "",
    whyJoin: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.submitCareerApplication(formData);

      setSubmitted(true);

    } catch (error) {
      console.error(error);

      alert("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-[32px] border border-slate-200 bg-white p-16 text-center shadow-xl">

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

      <form
        onSubmit={handleSubmit}
        className="p-8 md:p-12 space-y-10"
      >

        {/* PERSONAL */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          />

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
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
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          >
            <option value="">Select Role</option>

            {roles.map((role, index) => (
              <option key={index}>
                {role}
              </option>
            ))}
          </select>

        </div>

        {/* INTERNSHIP TYPE */}

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
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Projects / Experience"
          className="w-full rounded-2xl border border-slate-300 px-5 py-4 resize-none"
        />

        <textarea
          rows={6}
          name="whyJoin"
          value={formData.whyJoin}
          onChange={handleChange}
          placeholder="Why do you want to join SSC?"
          required
          className="w-full rounded-2xl border border-slate-300 px-5 py-4 resize-none"
        />

        {/* SUBMIT */}

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