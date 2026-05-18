"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Loader2, CheckCircle2 } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════
// CONTACT FORM - Production-Ready Implementation
// ═══════════════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔵 [ContactForm] Component Module Loaded');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('API_BASE_URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Timestamp:', new Date().toISOString());
  console.log('═══════════════════════════════════════════════════════════');
}

// Controlled form initial schema (no external validators)

export function ContactForm({ services }) {
  console.log('🟢 [ContactForm] Component rendering. Services:', services?.length || 0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // Controlled form state
  const initialState = {
    name: "",
    email: "",
    phone: "",
    company: "",
    businessType: "",
    projectGoal: "",
    urgency: "",
    serviceOfInterest: "",
    message: "",
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitForm = async () => {
    console.log('\n' + '█'.repeat(60));
    console.log('📝 [ContactForm] Controlled submit flow starting');
    console.log('█'.repeat(60));
    console.log('Form data received:', {
      keys: Object.keys(formData),
      name: formData.name,
      email: formData.email,
      timestamp: new Date().toISOString()
    });

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const extendedMessage = `\n[Qualification Data]\nBusiness Type: ${formData.businessType || 'Not specified'}\nProject Goal: ${formData.projectGoal || 'Not specified'}\nUrgency: ${formData.urgency || 'Not specified'}\n\n[Original Message]\n${formData.message}`.trim();

      const payload = {
        ...formData,
        message: extendedMessage
      };

      console.log('📤 [ContactForm] Calling api.submitInquiry...');

      const response = await api.submitInquiry(payload);

      console.log('✅ [ContactForm] API SUCCESS!', {
        success: response.success,
        leadId: response.leadId
      });

      setIsSuccess(true);
      setFormData(initialState);
      console.log('✨ [ContactForm] Success state activated, form cleared');
      console.log('█'.repeat(60) + '\n');
    } catch (error) {
      console.error('❌ [ContactForm] SUBMISSION FAILED', {
        message: error.message,
        timestamp: new Date().toISOString()
      });
      setErrorMsg(error.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
      console.log('🏁 [ContactForm] Form submission complete');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await submitForm();
  };

  const handleButtonClick = async (e) => {
    e.preventDefault();
    console.log('📝 [ContactForm] Button click intercept fired');
    await submitForm();
  };

  // Render success state
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <CheckCircle2 className="h-16 w-16 text-brand-emerald" />
        <h4 className="text-2xl font-bold">Message Sent!</h4>
        <p className="text-slate-500">Thank you for reaching out. We will get back to you shortly.</p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="mt-6 text-brand-primary hover:underline font-medium"
        >
          Send another message
        </button>
      </div>
    );
  }

  // Render controlled form
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
          {errorMsg}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name *</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Your Name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address *</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Your Email"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Your Phone Number"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Company / Organization</label>
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Your Business Name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Business Type</label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select industry...</option>
            <option value="School / Institute">School / Institute</option>
            <option value="Restaurant / Hospitality">Restaurant / Hospitality</option>
            <option value="Clinic / Healthcare">Clinic / Healthcare</option>
            <option value="Retail / E-Commerce">Retail / E-Commerce</option>
            <option value="Service Business">Service Business</option>
            <option value="Startup / Agency">Startup / Agency</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Goal</label>
          <select
            name="projectGoal"
            value={formData.projectGoal}
            onChange={handleChange}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select primary goal...</option>
            <option value="Operational Automation (ERP/CRM)">Operational Automation (ERP/CRM)</option>
            <option value="Brand Authority & Web Presence">Brand Authority & Web Presence</option>
            <option value="Lead Generation & Marketing">Lead Generation & Marketing</option>
            <option value="Complete Digital Overhaul">Complete Digital Overhaul</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Service of Interest</label>
          <select
            name="serviceOfInterest"
            value={formData.serviceOfInterest}
            onChange={handleChange}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select a service...</option>
            {services.map((s, i) => (
              <option key={i} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Urgency</label>
          <select
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select timeline...</option>
            <option value="ASAP (Within 1-2 Weeks)">ASAP (Within 1-2 Weeks)</option>
            <option value="Within 1 Month">Within 1 Month</option>
            <option value="1-3 Months">1-3 Months</option>
            <option value="Just Exploring Options">Just Exploring Options</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Your Message *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          required
          className="w-full flex min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Tell us about your project requirements..."
        />
      </div>

      <button 
        type="submit"
        onClick={handleButtonClick}
        disabled={isSubmitting}
        className="w-full bg-brand-primary text-white h-12 rounded-md font-medium hover:bg-brand-primary/90 transition-colors flex items-center justify-center disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
