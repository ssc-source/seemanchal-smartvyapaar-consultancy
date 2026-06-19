"use client";

import { useState } from "react";
import { useToast } from '@/components/ui/Toast';

import { api } from "@/lib/api";

import {
  ArrowRight,
  Globe,
  Link,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

export default function CommunityApplication() {

  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    profession: "",
    skills: "",
    linkedin: "",
    github: "",
    reason: "",
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

      await api.submitCommunityApplication(formData);

      setSubmitted(true);

    } catch (error) {

      console.error(error);

      if (toast && toast.error) {
        toast.error('Failed to submit application');
      } else if (typeof window !== 'undefined' && window.__TOAST_FALLBACK__) {
        window.__TOAST_FALLBACK__('Failed to submit application');
      } else {
        alert('Failed to submit application');
      }

    } finally {

      setLoading(false);

    }

  };

  if (submitted) {

    return (
      <div className="rounded-4xl border border-slate-200 bg-white p-16 text-center shadow-xl">

        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <Users className="h-10 w-10 text-green-600" />
        </div>

        <h2 className="text-5xl font-bold text-slate-900 mb-6">
          Welcome To SSC Community
        </h2>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Thank you for joining the SSC ecosystem.
          Our team will connect with you soon.
        </p>

      </div>
    );

  }

  return (

    <div className="rounded-[36px] border border-slate-200 bg-white shadow-2xl overflow-hidden">

      <div className="bg-linear-to-r from-brand-accent to-blue-700 px-10 py-12 text-white">

        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold mb-6">

          <Sparkles className="h-4 w-4" />

          Join Our Network

        </div>

        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
          Join The SSC Community
        </h2>

        <p className="text-blue-100 text-lg max-w-3xl">
          Connect with developers, founders, creators,
          students, and innovators building the future.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 md:p-12 space-y-8"
      >

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
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          />

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <input
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder="Profession"
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          />

          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Skills"
            className="w-full rounded-2xl border border-slate-300 px-5 py-4"
          />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

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

          <div className="relative">

            <Globe className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="GitHub / Portfolio"
              className="w-full rounded-2xl border border-slate-300 pl-12 pr-5 py-4"
            />

          </div>

        </div>

        <textarea
          rows={6}
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Why do you want to join SSC Community?"
          required
          className="w-full rounded-2xl border border-slate-300 px-5 py-4 resize-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-3 rounded-2xl bg-brand-accent px-8 py-5 text-lg font-semibold text-white hover:opacity-90 transition-all"
        >

          {loading ? "Submitting..." : "Join Community"}

          <ArrowRight className="h-5 w-5" />

        </button>

      </form>

    </div>

  );

}