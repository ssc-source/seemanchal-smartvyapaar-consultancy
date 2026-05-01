"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/api";
import { Loader2, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  businessType: z.string().optional(),
  projectGoal: z.string().optional(),
  urgency: z.string().optional(),
  serviceOfInterest: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function ContactForm({ services }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      // Format extended qualification data into the message field
      const extendedMessage = `
[Qualification Data]
Business Type: ${data.businessType || 'Not specified'}
Project Goal: ${data.projectGoal || 'Not specified'}
Urgency: ${data.urgency || 'Not specified'}

[Original Message]
${data.message}
      `.trim();

      const payload = {
        ...data,
        message: extendedMessage
      };

      await api.submitInquiry(payload);
      setIsSuccess(true);
      reset();
    } catch (error) {
      setErrorMsg(error.message || "Failed to connect to the server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
          {errorMsg}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name *</label>
          <input 
            {...register("name")} 
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
            placeholder="Your Name"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address *</label>
          <input 
            {...register("email")} 
            type="email"
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
            placeholder="Your Email"
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <input 
            {...register("phone")} 
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
            placeholder="Your Phone Number"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Company / Organization</label>
          <input 
            {...register("company")} 
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
            placeholder="Your Business Name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Business Type</label>
          <select 
            {...register("businessType")}
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
            {...register("projectGoal")}
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
            {...register("serviceOfInterest")}
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
            {...register("urgency")}
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
          {...register("message")} 
          rows={4}
          className="w-full flex min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
          placeholder="Tell us about your project requirements..."
        />
        {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
      </div>

      <button 
        type="submit" 
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
