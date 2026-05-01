export const content = {
  hero: {
    headline: "Digital Transformation & Growth Systems for Modern Businesses",
    subheadline: "We build premium, scalable, and automated digital infrastructure for schools, institutions, local businesses, and startups in Seemanchal and beyond.",
    primaryCTA: { label: "Get a Custom Solution Plan", href: "/contact" },
    secondaryCTA: { label: "Explore Our Systems", href: "/services" },
  },
  stats: [
    { label: "Business Systems Deployed", value: "5+" },
    { label: "Institutions & Brands Scaled", value: "3+" },
    { label: "Years Engineering Growth", value: "1+" },
    { label: "Client Operational Success", value: "100%" },
  ],
  services: [
    { 
      id: "business-website-systems", 
      title: "Business Website Systems", 
      description: "High-performance digital platforms engineered for conversion, brand authority, and lead generation.", 
      icon: "Globe", 
      details: "Stop using a basic website. We build digital conversion systems.",
      idealFor: ["Corporate Enterprises", "Local Service Businesses", "Startups", "Clinics & Healthcare"],
      outcomes: ["Higher Lead Generation", "Instant Market Authority", "Automated Booking/Sales"],
      modules: ["Landing Pages & Sales Funnels", "Appointment & Booking Integrations", "Premium Portfolio Showcases", "Technical SEO & Speed Optimization"]
    },
    { 
      id: "school-institute-management", 
      title: "School & Institute Management Systems", 
      description: "Comprehensive ERP software and digital infrastructure tailored for educational operational scale.", 
      icon: "GraduationCap", 
      details: "Automate your daily operations and focus on education.",
      idealFor: ["Private Schools", "Coaching Institutes", "Colleges", "Training Centers"],
      outcomes: ["Zero Paperwork", "Automated Fee Collection", "Improved Parent Satisfaction"],
      modules: ["Admissions & Lead Management", "Fee Collection & Invoicing", "Attendance & Academics tracking", "Parent Communication Portals", "Transport Management"]
    },
    { 
      id: "restaurant-hospitality-systems", 
      title: "Restaurant & Hospitality Systems", 
      description: "End-to-end digital ordering, visibility, and retention systems for the hospitality industry.", 
      icon: "Coffee", 
      details: "Increase direct orders and eliminate third-party commission dependence.",
      idealFor: ["Fine Dining Restaurants", "Cafes", "Hotels", "Cloud Kitchens"],
      outcomes: ["0% Commission Ordering", "Higher Customer Retention", "Streamlined Kitchen Ops"],
      modules: ["Digital Menu & QR Ordering", "Direct Online Ordering Systems", "WhatsApp Automation Integration", "Google Maps & Local Dominance", "Customer Retention Programs"]
    },
    { 
      id: "operations-automation", 
      title: "Operations & Automation Systems", 
      description: "Custom software and workflow automation to eliminate manual tasks and scale your business.", 
      icon: "Settings", 
      details: "Centralize your operations and increase daily efficiency.",
      idealFor: ["Logistics", "Retail Chains", "B2B Distributors", "Real Estate"],
      outcomes: ["Reduced Labor Costs", "Zero Data Entry Errors", "Real-Time Business Analytics"],
      modules: ["Custom Business Workflows", "CRM Implementation", "Digital Invoicing & Payments", "Data Analytics & Reporting"]
    },
    { 
      id: "brand-identity", 
      title: "Brand Identity Systems", 
      description: "Premium visual identity engineering that establishes absolute market authority and trust.", 
      icon: "Palette", 
      details: "Look like the market leader from day one.",
      idealFor: ["New Startups", "Rebranding Legacy Businesses", "Franchises", "Personal Brands"],
      outcomes: ["Premium Market Positioning", "Consistent Customer Experience", "Higher Perceived Value"],
      modules: ["Premium Logo Architecture", "Comprehensive Brand Guidelines", "Marketing Material Design", "Visual Strategy Consulting"]
    },
    { 
      id: "local-visibility-seo", 
      title: "Local Visibility & SEO Systems", 
      description: "Dominate local search results and capture high-intent customers in your region organically.", 
      icon: "TrendingUp", 
      details: "Be the first business customers see when they search.",
      idealFor: ["Local Clinics", "Retail Stores", "Law Firms", "Home Service Providers"],
      outcomes: ["Daily Organic Inquiries", "Top 3 Google Ranking", "Trusted Brand Reputation"],
      modules: ["Google My Business Optimization", "Local Keyword Dominance", "Reputation & Review Management", "Organic Lead Generation"]
    },
  ],
  useCases: [
    { industry: "Schools & Education", description: "Automate admissions, digitize fee collection, and connect parents instantly with our Education ERP." },
    { industry: "Restaurants & Cafes", description: "Stop paying massive aggregator commissions. Launch your own direct digital ordering system." },
    { industry: "Clinics & Healthcare", description: "Digitize patient records, automate appointment scheduling, and rank #1 locally on Google." },
    { industry: "Retail & E-Commerce", description: "Expand beyond your physical storefront. Sell inventory 24/7 with a seamless digital storefront." },
    { industry: "Service Businesses", description: "Capture leads automatically, generate digital invoices, and establish authority over local competitors." },
    { industry: "Startups & Agencies", description: "Launch with a premium, investor-ready digital infrastructure that scales as fast as your ambition." }
  ],
  implementationProcess: [
    { title: "1. Discovery & Blueprint", description: "We analyze your business operations and architect a custom digital system tailored to your growth targets." },
    { title: "2. System Engineering", description: "Our team builds, integrates, and tests the complete digital infrastructure, ensuring premium quality and performance." },
    { title: "3. Onboarding & Training", description: "We deploy the system and train your team on operational workflows for immediate business impact." },
    { title: "4. Support & Scaling", description: "Ongoing technical support, maintenance, and strategic guidance to continuously scale your operations." }
  ],
  projects: [
    { 
      id: "skand-vidya-peeth", 
      title: "Skand Vidya Peeth", 
      category: "Education System", 
      businessType: "Private School",
      summary: "Modern institutional portal with deep student management integration.", 
      problem: "Manual fee collection, chaotic paper-based admissions, and disconnected parent communication.",
      solution: "Deployed a centralized School ERP with digital fee gateways, automated attendance tracking, and dedicated parent portals.",
      outcome: "100% digital fee tracking, 40% faster admission processing, and zero manual data entry errors.",
      tools: ["React", "Express ERP", "Payment Gateway"],
      image: "/assets/proof/skand.png",
      href: "/projects/skand-vidya-peeth" 
    },
    { 
      id: "rj-concept", 
      title: "RJ Concept", 
      category: "Digital Infrastructure", 
      businessType: "Corporate Agency",
      summary: "Premium corporate authority platform and automated lead generation.", 
      problem: "Lack of absolute market authority and low-quality inbound inquiries from generic contact forms.",
      solution: "Architected a premium glassmorphic dark-mode web presence with a high-friction, high-intent lead qualification funnel.",
      outcome: "3x increase in qualified corporate leads and immediate elevation in perceived brand value.",
      tools: ["Next.js", "Tailwind CSS", "Framer Motion"],
      image: "/assets/proof/rj.png",
      href: "https://rjconcept-frontend.vercel.app" 
    },
    { 
      id: "rpl-araria", 
      title: "RPL Araria", 
      category: "Sports Operations", 
      businessType: "Tournament Organizer",
      summary: "Dynamic tournament platform with live operational scoring updates.", 
      problem: "Inability to broadcast live match scores to regional fans, resulting in low digital engagement.",
      solution: "Built a high-performance live scoring dashboard with real-time websocket updates and a mobile-first interface.",
      outcome: "Thousands of concurrent live viewers, massive local digital engagement, and streamlined match operations.",
      tools: ["WebSockets", "React Native", "Node.js"],
      image: "/assets/proof/rpl.png",
      href: "https://www.rplararia.com" 
    },
    { 
      id: "jaiswal-hotel", 
      title: "Jaiswal Hotel", 
      category: "Hospitality System", 
      businessType: "Luxury Hotel",
      summary: "Elegant hospitality booking engine showcasing premium services.", 
      problem: "Heavy reliance on third-party aggregators (MakeMyTrip, Agoda) eating 20%+ in commission margins.",
      solution: "Engineered a direct booking engine with premium room showcases, real-time availability, and integrated payments.",
      outcome: "0% commission on direct bookings, automated room management, and higher direct brand loyalty.",
      tools: ["Next.js", "PostgreSQL", "Stripe"],
      image: "/assets/proof/jaiswal.png",
      href: "/projects/jaiswal-hotel" 
    },
    { 
      id: "madan-bhog", 
      title: "Madan Bhog", 
      category: "Restaurant System", 
      businessType: "Premium Restaurant",
      summary: "Appetizing digital presence with streamlined direct online ordering.", 
      problem: "Losing margin to Zomato/Swiggy and dealing with chaotic phone orders during peak hours.",
      solution: "Implemented a direct digital menu and QR ordering system with WhatsApp automation for order tracking.",
      outcome: "Eliminated aggregator fees for loyal customers, completely digitized kitchen order flow.",
      tools: ["QR System", "WhatsApp API", "React"],
      image: "/assets/proof/madan.png",
      href: "/projects/madan-bhog" 
    },
    { 
      id: "cricket-streaming", 
      title: "Cricket Streaming Platform", 
      category: "Digital Automation", 
      businessType: "Media Broadcaster",
      summary: "High-performance live streaming and digital sports infrastructure.", 
      problem: "Need for a scalable, low-latency video streaming infrastructure to handle unpredictable traffic spikes.",
      solution: "Architected a dark-themed, cloud-scalable video streaming dashboard with integrated live chat and stats.",
      outcome: "Zero downtime during peak matches, high viewer retention, and professional broadcasting capability.",
      tools: ["NodeJS", "React", "Socket.io"],
      image: "/assets/proof/cricket.png",
      href: "/projects/cricket-streaming" 
    },
  ],
  whyChooseUs: [
    { title: "Practical Indian Business Focus", description: "We understand the operational realities of regional businesses. We build systems that solve real daily problems, not just look pretty." },
    { title: "Premium Engineering Standards", description: "We deliver modern SaaS-level software quality to elevate your brand above regional competition and build absolute market authority." },
    { title: "Outcome-Driven Implementations", description: "We don't just execute tasks; we implement systems designed explicitly to reduce manual workload and increase direct revenue." },
    { title: "Reliable Operational Support", description: "Technology works best when supported. We provide dedicated technical guidance ensuring your digital infrastructure runs flawlessly 24/7." },
  ],
  testimonials: [
    { quote: "SSC didn't just build a website; they transformed our school's digital operations. The ERP system has centralized everything.", author: "Kundan Kumar, Principal", organization: "Skand Vidya Peeth", context: "Result: Automated fee tracking and admissions for 500+ students." },
    { quote: "Our business system now runs on autopilot. The premium authority platform they built immediately generated high-value corporate leads.", author: "Rahul Jha, MD", organization: "RJ Concept", context: "Result: 3x increase in qualified inbound leads." },
    { quote: "SSC transformed how we run and present RPL digitally. From live match visibility to real-time audience engagement.", author: "RPL Management", organization: "RPL Araria", context: "Result: Thousands of live viewers, stronger regional engagement, and streamlined tournament operations." }
  ],
  faqs: [
    { question: "Do you only build websites, or full operational software?", answer: "We build comprehensive digital systems. While a premium website is often the front door, we integrate CRMs, ERPs, direct ordering systems, and automated workflows behind it to scale your actual business operations." },
    { question: "How long does a digital transformation project take?", answer: "Depending on the complexity, a standard business system (like a lead generation platform) takes 2-4 weeks. Larger operational systems (like a School ERP or Custom Workflow App) take 4-8 weeks to architect, build, and deploy." },
    { question: "What happens after the system is launched?", answer: "We provide comprehensive onboarding for your team. After launch, we offer ongoing maintenance, technical support, and strategic scaling advice so your technology grows as your business grows." },
    { question: "Are your systems suitable for small local businesses?", answer: "Absolutely. We specialize in bringing enterprise-grade technology to regional businesses. Whether you are a single clinic or a multi-branch school, we scale the solution to fit your specific operational needs and budget." },
  ],
  about: {
    story: "Seemanchal SmartVyapaar Consultancy (SSC) is a premium digital systems and business transformation company. We bridge the technology gap for regional businesses, schools, and institutions by providing Silicon Valley standard digital infrastructure that scales operations and drives measurable growth.",
    mission: "To engineer scalable digital systems and growth infrastructure for multi-industry businesses, enabling them to dominate their markets through operational efficiency and premium digital presence.",
    vision: "To be the leading business transformation platform in Bihar, known for engineering trust, delivering enterprise-grade quality, and fostering regional digital independence."
  },
  footer: {
    description: "Empowering businesses and institutions with premium digital infrastructure. We engineer your operational scale.",
    quickLinks: [
      { label: "Home", href: "/" },
      { label: "Platform Overview", href: "/about" },
      { label: "Our Systems", href: "/services" },
      { label: "Case Studies", href: "/projects" },
      { label: "Book Consultation", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ]
  },
  privacyPolicy: {
    title: "Privacy Policy",
    description: "Your privacy is important to us. This policy explains how we collect, use, and protect your information.",
    dataCollection: {
      title: "Data Collection",
      description: "We collect information you provide directly to us, such as when you fill out a contact form or book a consultation. We also collect technical data automatically when you visit our website, such as your IP address and browsing behavior."
    },
    dataUsage: {
      title: "Data Usage",
      description: "We use the information we collect to respond to inquiries, provide services, improve our website, and send occasional updates about our offerings. We do not sell or rent your information to third parties."
    },
    dataSharing: {
      title: "Data Sharing",
      description: "We may share your information with trusted service providers who assist us in operating our business and providing services to you. These providers are obligated to keep your information confidential and secure."
    },
    userRights: {
      title: "User Rights",
      description: "You have the right to access, correct, or delete your personal information. You can also opt out of receiving marketing communications from us at any time by following the unsubscribe instructions in our emails."
    }
  }, 
  termsOfService: {
    title: "Terms of Service",
    description: "By using our website and services, you agree to the following terms and conditions. Please read them carefully before engaging with our offerings.",
    useOfServices: "You agree to use our services only for lawful purposes and in accordance with these terms. You are responsible for any content you submit and must not engage in any activity that could harm our business or reputation.",
    intellectualProperty: "All content and materials on our website, including text, graphics, logos, and software, are the property of Seemanchal SmartVyapaar Consultancy and are protected by intellectual property laws. You may not use, reproduce, or distribute any content without our express written permission.",
    disclaimers: "Our services are provided 'as is' without any warranties. We do not guarantee that our services will be uninterrupted or error-free. We are not liable for any damages arising from the use of our services.",
    modifications: "We reserve the right to modify these terms at any time. Any changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes your acceptance of the new terms."
  }
};
