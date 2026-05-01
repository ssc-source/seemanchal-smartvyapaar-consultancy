require('dotenv').config();
const { sequelize, Service, Project, Testimonial, Setting, HomepageSection } = require('./models');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Sync schema (alter: true adds new columns without dropping)
    await sequelize.sync({ alter: true });
    console.log('Schema synced.');

    // Clear existing data
    await Setting.destroy({ where: {} });
    await Service.destroy({ where: {} });
    await Project.destroy({ where: {} });
    await Testimonial.destroy({ where: {} });
    await HomepageSection.destroy({ where: {} });
    console.log('Old data cleared.');

    // ===== SETTINGS =====
    await Setting.bulkCreate([
      { key: 'siteName', value: 'SSC Consultancy' },
      { key: 'contactEmail', value: 'info@ssc.com' },
      { key: 'contactPhone', value: '+91-9876543210' },
      { key: 'address', value: 'Seemanchal, Bihar, India' },
    ]);
    console.log('Settings seeded.');

    // ===== SERVICES (Full Phase 7) =====
    await Service.bulkCreate([
      {
        title: 'Business Website Systems',
        slug: 'business-website-systems',
        shortDescription: 'High-performance digital platforms engineered for conversion, brand authority, and lead generation.',
        fullDescription: 'Stop using a basic website. We build digital conversion systems.',
        icon: 'Globe',
        idealFor: ['Corporate Enterprises', 'Local Service Businesses', 'Startups', 'Clinics & Healthcare'],
        outcomes: ['Higher Lead Generation', 'Instant Market Authority', 'Automated Booking/Sales'],
        modules: ['Landing Pages & Sales Funnels', 'Appointment & Booking Integrations', 'Premium Portfolio Showcases', 'Technical SEO & Speed Optimization'],
        isActive: true,
      },
      {
        title: 'School & Institute Management Systems',
        slug: 'school-institute-management',
        shortDescription: 'Comprehensive ERP software and digital infrastructure tailored for educational operational scale.',
        fullDescription: 'Automate your daily operations and focus on education.',
        icon: 'GraduationCap',
        idealFor: ['Private Schools', 'Coaching Institutes', 'Colleges', 'Training Centers'],
        outcomes: ['Zero Paperwork', 'Automated Fee Collection', 'Improved Parent Satisfaction'],
        modules: ['Admissions & Lead Management', 'Fee Collection & Invoicing', 'Attendance & Academics tracking', 'Parent Communication Portals', 'Transport Management'],
        isActive: true,
      },
      {
        title: 'Restaurant & Hospitality Systems',
        slug: 'restaurant-hospitality-systems',
        shortDescription: 'End-to-end digital ordering, visibility, and retention systems for the hospitality industry.',
        fullDescription: 'Increase direct orders and eliminate third-party commission dependence.',
        icon: 'Coffee',
        idealFor: ['Fine Dining Restaurants', 'Cafes', 'Hotels', 'Cloud Kitchens'],
        outcomes: ['0% Commission Ordering', 'Higher Customer Retention', 'Streamlined Kitchen Ops'],
        modules: ['Digital Menu & QR Ordering', 'Direct Online Ordering Systems', 'WhatsApp Automation Integration', 'Google Maps & Local Dominance', 'Customer Retention Programs'],
        isActive: true,
      },
      {
        title: 'Operations & Automation Systems',
        slug: 'operations-automation',
        shortDescription: 'Custom software and workflow automation to eliminate manual tasks and scale your business.',
        fullDescription: 'Centralize your operations and increase daily efficiency.',
        icon: 'Settings',
        idealFor: ['Logistics', 'Retail Chains', 'B2B Distributors', 'Real Estate'],
        outcomes: ['Reduced Labor Costs', 'Zero Data Entry Errors', 'Real-Time Business Analytics'],
        modules: ['Custom Business Workflows', 'CRM Implementation', 'Digital Invoicing & Payments', 'Data Analytics & Reporting'],
        isActive: true,
      },
      {
        title: 'Brand Identity Systems',
        slug: 'brand-identity',
        shortDescription: 'Premium visual identity engineering that establishes absolute market authority and trust.',
        fullDescription: 'Look like the market leader from day one.',
        icon: 'Palette',
        idealFor: ['New Startups', 'Rebranding Legacy Businesses', 'Franchises', 'Personal Brands'],
        outcomes: ['Premium Market Positioning', 'Consistent Customer Experience', 'Higher Perceived Value'],
        modules: ['Premium Logo Architecture', 'Comprehensive Brand Guidelines', 'Marketing Material Design', 'Visual Strategy Consulting'],
        isActive: true,
      },
      {
        title: 'Local Visibility & SEO Systems',
        slug: 'local-visibility-seo',
        shortDescription: 'Dominate local search results and capture high-intent customers in your region organically.',
        fullDescription: 'Be the first business customers see when they search.',
        icon: 'TrendingUp',
        idealFor: ['Local Clinics', 'Retail Stores', 'Law Firms', 'Home Service Providers'],
        outcomes: ['Daily Organic Inquiries', 'Top 3 Google Ranking', 'Trusted Brand Reputation'],
        modules: ['Google My Business Optimization', 'Local Keyword Dominance', 'Reputation & Review Management', 'Organic Lead Generation'],
        isActive: true,
      },
    ]);
    console.log('Services seeded (6 full Phase 7 services).');

    // ===== PROJECTS (Full Phase 7 Case Studies) =====
    await Project.bulkCreate([
      {
        title: 'Skand Vidya Peeth',
        slug: 'skand-vidya-peeth',
        category: 'Education System',
        businessType: 'Private School',
        clientName: 'Skand Vidya Peeth',
        summary: 'Modern institutional portal with deep student management integration.',
        problem: 'Manual fee collection, chaotic paper-based admissions, and disconnected parent communication.',
        solution: 'Deployed a centralized School ERP with digital fee gateways, automated attendance tracking, and dedicated parent portals.',
        outcome: '100% digital fee tracking, 40% faster admission processing, and zero manual data entry errors.',
        tools: ['React', 'Express ERP', 'Payment Gateway'],
        featuredImage: '/assets/proof/skand_erp_dashboard.png',
        isActive: true,
      },
      {
        title: 'RJ Concept',
        slug: 'rj-concept',
        category: 'Digital Infrastructure',
        businessType: 'Corporate Agency',
        clientName: 'RJ Concept',
        summary: 'Premium corporate authority platform and automated lead generation.',
        problem: 'Lack of absolute market authority and low-quality inbound inquiries from generic contact forms.',
        solution: 'Architected a premium glassmorphic dark-mode web presence with a high-friction, high-intent lead qualification funnel.',
        outcome: '3x increase in qualified corporate leads and immediate elevation in perceived brand value.',
        tools: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
        featuredImage: '/assets/proof/rj_concept_website.png',
        isActive: true,
      },
      {
        title: 'RPL Araria',
        slug: 'rpl-araria',
        category: 'Sports Operations',
        businessType: 'Tournament Organizer',
        clientName: 'RPL Araria',
        summary: 'Dynamic tournament platform with live operational scoring updates.',
        problem: 'Inability to broadcast live match scores to regional fans, resulting in low digital engagement.',
        solution: 'Built a high-performance live scoring dashboard with real-time websocket updates and a mobile-first interface.',
        outcome: 'Thousands of concurrent live viewers, massive local digital engagement, and streamlined match operations.',
        tools: ['WebSockets', 'React Native', 'Node.js'],
        featuredImage: '/assets/proof/rpl_araria_app.png',
        isActive: true,
      },
      {
        title: 'Jaiswal Hotel',
        slug: 'jaiswal-hotel',
        category: 'Hospitality System',
        businessType: 'Luxury Hotel',
        clientName: 'Jaiswal Hotel',
        summary: 'Elegant hospitality booking engine showcasing premium services.',
        problem: 'Heavy reliance on third-party aggregators (MakeMyTrip, Agoda) eating 20%+ in commission margins.',
        solution: 'Engineered a direct booking engine with premium room showcases, real-time availability, and integrated payments.',
        outcome: '0% commission on direct bookings, automated room management, and higher direct brand loyalty.',
        tools: ['Next.js', 'PostgreSQL', 'Stripe'],
        featuredImage: '/assets/proof/jaiswal_hotel_booking.png',
        isActive: true,
      },
      {
        title: 'Madan Bhog',
        slug: 'madan-bhog',
        category: 'Restaurant System',
        businessType: 'Premium Restaurant',
        clientName: 'Madan Bhog',
        summary: 'Appetizing digital presence with streamlined direct online ordering.',
        problem: 'Losing margin to Zomato/Swiggy and dealing with chaotic phone orders during peak hours.',
        solution: 'Implemented a direct digital menu and QR ordering system with WhatsApp automation for order tracking.',
        outcome: 'Eliminated aggregator fees for loyal customers, completely digitized kitchen order flow.',
        tools: ['QR System', 'WhatsApp API', 'React'],
        featuredImage: '/assets/proof/madan_bhog_menu.png',
        isActive: true,
      },
      {
        title: 'Cricket Streaming Platform',
        slug: 'cricket-streaming',
        category: 'Digital Automation',
        businessType: 'Media Broadcaster',
        clientName: 'Cricket Streaming',
        summary: 'High-performance live streaming and digital sports infrastructure.',
        problem: 'Need for a scalable, low-latency video streaming infrastructure to handle unpredictable traffic spikes.',
        solution: 'Architected a dark-themed, cloud-scalable video streaming dashboard with integrated live chat and stats.',
        outcome: 'Zero downtime during peak matches, high viewer retention, and professional broadcasting capability.',
        tools: ['AWS MediaLive', 'React', 'Socket.io'],
        featuredImage: '/assets/proof/cricket_streaming.png',
        isActive: true,
      },
    ]);
    console.log('Projects seeded (6 full Phase 7 case studies).');

    // ===== TESTIMONIALS (Full Phase 7 with context) =====
    await Testimonial.bulkCreate([
      {
        clientName: 'Principal',
        clientRole: 'School Administrator',
        companyName: 'Skand Vidya Peeth',
        content: "SSC didn't just build a website; they transformed our school's digital operations. The ERP system has centralized everything.",
        context: 'Result: Automated fee tracking and admissions for 500+ students.',
        rating: 5,
        isActive: true,
      },
      {
        clientName: 'Ravi Jaiswal',
        clientRole: 'Business Owner',
        companyName: 'RJ Concept',
        content: 'Our business system now runs on autopilot. The premium authority platform they built immediately generated high-value corporate leads.',
        context: 'Result: 3x increase in qualified inbound leads.',
        rating: 5,
        isActive: true,
      },
      {
        clientName: 'Amit Kumar',
        clientRole: 'Enterprise Owner',
        companyName: 'Local Enterprise',
        content: 'The strategic digital transition provided by SSC has given our operations massive local visibility. They truly build growth infrastructure.',
        context: 'Result: Ranked #1 locally for targeted business keywords.',
        rating: 5,
        isActive: true,
      },
    ]);
    console.log('Testimonials seeded (3 with context).');

    // ===== HOMEPAGE SECTIONS (Full Phase 7) =====
    await HomepageSection.bulkCreate([
      {
        sectionKey: 'hero',
        title: 'Hero Section',
        content: {
          headline: 'Digital Transformation & Growth Systems for Modern Businesses',
          subheadline: 'We build premium, scalable, and automated digital infrastructure for schools, institutions, local businesses, and startups in Seemanchal and beyond.',
          primaryCTA: { label: 'Get a Custom Solution Plan', href: '/contact' },
          secondaryCTA: { label: 'Explore Our Systems', href: '/services' },
        },
        isActive: true,
      },
      {
        sectionKey: 'stats',
        title: 'Stats Section',
        content: [
          { label: 'Business Systems Deployed', value: '50+' },
          { label: 'Institutions & Brands Scaled', value: '30+' },
          { label: 'Years Engineering Growth', value: '5+' },
          { label: 'Client Operational Success', value: '99%' },
        ],
        isActive: true,
      },
      {
        sectionKey: 'useCases',
        title: 'Use Cases Section',
        content: [
          { industry: 'Schools & Education', description: 'Automate admissions, digitize fee collection, and connect parents instantly with our Education ERP.' },
          { industry: 'Restaurants & Cafes', description: 'Stop paying massive aggregator commissions. Launch your own direct digital ordering system.' },
          { industry: 'Clinics & Healthcare', description: 'Digitize patient records, automate appointment scheduling, and rank #1 locally on Google.' },
          { industry: 'Retail & E-Commerce', description: 'Expand beyond your physical storefront. Sell inventory 24/7 with a seamless digital storefront.' },
          { industry: 'Service Businesses', description: 'Capture leads automatically, generate digital invoices, and establish authority over local competitors.' },
          { industry: 'Startups & Agencies', description: 'Launch with a premium, investor-ready digital infrastructure that scales as fast as your ambition.' },
        ],
        isActive: true,
      },
      {
        sectionKey: 'whyChooseUs',
        title: 'Why Choose Us',
        content: [
          { title: 'Practical Indian Business Focus', description: 'We understand the operational realities of regional businesses. We build systems that solve real daily problems, not just look pretty.' },
          { title: 'Premium Engineering Standards', description: 'We deliver modern SaaS-level software quality to elevate your brand above regional competition and build absolute market authority.' },
          { title: 'Outcome-Driven Implementations', description: "We don't just execute tasks; we implement systems designed explicitly to reduce manual workload and increase direct revenue." },
          { title: 'Reliable Operational Support', description: 'Technology works best when supported. We provide dedicated technical guidance ensuring your digital infrastructure runs flawlessly 24/7.' },
        ],
        isActive: true,
      },
      {
        sectionKey: 'implementationProcess',
        title: 'Implementation Process',
        content: [
          { title: '1. Discovery & Blueprint', description: 'We analyze your business operations and architect a custom digital system tailored to your growth targets.' },
          { title: '2. System Engineering', description: 'Our team builds, integrates, and tests the complete digital infrastructure, ensuring premium quality and performance.' },
          { title: '3. Onboarding & Training', description: 'We deploy the system and train your team on operational workflows for immediate business impact.' },
          { title: '4. Support & Scaling', description: 'Ongoing technical support, maintenance, and strategic guidance to continuously scale your operations.' },
        ],
        isActive: true,
      },
      {
        sectionKey: 'faqs',
        title: 'FAQs',
        content: [
          { question: 'Do you only build websites, or full operational software?', answer: 'We build comprehensive digital systems. While a premium website is often the front door, we integrate CRMs, ERPs, direct ordering systems, and automated workflows behind it to scale your actual business operations.' },
          { question: 'How long does a digital transformation project take?', answer: 'Depending on the complexity, a standard business system (like a lead generation platform) takes 2-4 weeks. Larger operational systems (like a School ERP or Custom Workflow App) take 4-8 weeks to architect, build, and deploy.' },
          { question: 'What happens after the system is launched?', answer: 'We provide comprehensive onboarding for your team. After launch, we offer ongoing maintenance, technical support, and strategic scaling advice so your technology grows as your business grows.' },
          { question: 'Are your systems suitable for small local businesses?', answer: 'Absolutely. We specialize in bringing enterprise-grade technology to regional businesses. Whether you are a single clinic or a multi-branch school, we scale the solution to fit your specific operational needs and budget.' },
        ],
        isActive: true,
      },
    ]);
    console.log('Homepage sections seeded (hero, stats, useCases, whyChooseUs, implementationProcess, faqs).');

    console.log('\n✅ Full Phase 7 seed complete. All CMS data is live.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
