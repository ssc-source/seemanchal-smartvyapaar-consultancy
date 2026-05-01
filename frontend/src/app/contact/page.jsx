import { contentAdapter } from "@/lib/contentAdapter";
import { ContactForm } from "@/components/ui/contact-form";
import { MapPin, Phone, Mail } from "lucide-react";
import { siteConfig } from "../../../config/site";
import { setTarget } from "framer-motion";

export const metadata = {
  title: "Contact Us | Seemanchal SmartVyapaar Consultancy",
  description: "Get in touch with Seemanchal SmartVyapaar Consultancy for your digital needs.",
};

export default async function ContactPage() {
  const settings = await contentAdapter.resolveSettings();
  const services = await contentAdapter.resolveServices();

  return (
    <main className="flex min-h-screen flex-col items-center pb-24">
      {/* Header */}
      <section className="w-full bg-linear-to-b from-slate-50 to-white py-20 px-6 text-center border-b border-slate-200/60">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">Contact Us</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Ready to start your digital journey? Send us a message and our team will get back to you within 24 hours.
        </p>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Get in Touch</h2>
              <p className="text-lg text-slate-500 mb-8">
                Whether you need a simple website or a complex enterprise system, we have the expertise to deliver. Let&apos;s discuss your project.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">Office Address</h4>
                  <p className="text-slate-500">{siteConfig.contact.address || settings.contact.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">Phone / WhatsApp</h4>
                  <p className="text-slate-500">{siteConfig.contact.phone || settings.contact.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">Email Address</h4>
                  <p className="text-slate-500">{siteConfig.contact.email || settings.contact.email}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
              <h4 className="font-bold mb-2 text-slate-900">Office Hours</h4>
              <p className="text-slate-500">Monday - Saturday: 10:00 AM - 6:00 PM</p>
              <p className="text-slate-500">Sunday: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-slate-200/80 shadow-lg rounded-2xl p-8 md:p-10">
            <h3 className="text-2xl font-bold mb-8 text-slate-900">Send us a Message</h3>
            <ContactForm services={services} />
          </div>
        </div>
      </section>
    </main>
  );
}
