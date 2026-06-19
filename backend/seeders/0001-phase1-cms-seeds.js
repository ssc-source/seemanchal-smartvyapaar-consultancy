const { ContentPage, JobOpening, CommunityItem, Role, Permission, RolePermission, Setting, User } = require('../models');
const { ROLE_PERMISSIONS } = require('../security/permissions');

const settings = [
  { key: 'siteName', value: 'Seemanchal SmartVyapaar Consultancy' },
  { key: 'shortName', value: 'Seemanchal SmartVyapaar' },
  { key: 'contactEmail', value: 'info@seemanchalsmartvyapaar.com' },
  { key: 'contactPhone', value: '+91 6453356884' },
  { key: 'address', value: 'Araria, Bihar' },
  { key: 'facebookUrl', value: 'https://facebook.com/' },
  { key: 'linkedinUrl', value: 'https://seemanchalsmartvyapaar.com' },
  { key: 'instagramUrl', value: 'https://www.instagram.com/seemanchalsmartvyapaar/' },
  { key: 'twitterUrl', value: 'https://www.instagram.com/seemanchalsmartvyapaar/' },
  { key: 'assessment_price', value: '199' },
  { key: 'currency', value: 'INR' },
  { key: 'payment_enabled', value: 'true' },
  { key: 'invoice_prefix', value: 'SSC' },
  { key: 'refund_window_days', value: '7' },
];

const contentPages = [
  {
    slug: 'about',
    title: 'About Us',
    content: {
      story: "Seemanchal SmartVyapaar Consultancy (SSC) is a premium digital systems and business transformation company. We bridge the technology gap for regional businesses, schools, and institutions by providing Silicon Valley standard digital infrastructure that scales operations and drives measurable growth.",
      mission: "To engineer scalable digital systems and growth infrastructure for multi-industry businesses, enabling them to dominate their markets through operational efficiency and premium digital presence.",
      vision: "To be the leading business transformation platform in Bihar, known for engineering trust, delivering enterprise-grade quality, and fostering regional digital independence.",
    },
    status: 'published',
    displayOrder: 0,
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    content: {
      title: 'Privacy Policy',
      description: 'Your privacy is important to us. This policy explains how we collect, use, and protect your information.',
      dataCollection: {
        title: 'Data Collection',
        description: 'We collect information you provide directly to us, such as when you fill out a contact form or book a consultation. We also collect technical data automatically when you visit our website, such as your IP address and browsing behavior.',
      },
      dataUsage: {
        title: 'Data Usage',
        description: 'We use the information we collect to respond to inquiries, provide services, improve our website, and send occasional updates about our offerings. We do not sell or rent your information to third parties.',
      },
      dataSharing: {
        title: 'Data Sharing',
        description: 'We may share your information with trusted service providers who assist us in operating our business and providing services to you. These providers are obligated to keep your information confidential and secure.',
      },
      userRights: {
        title: 'User Rights',
        description: 'You have the right to access, correct, or delete your personal information. You can also opt out of receiving marketing communications from us at any time by following the unsubscribe instructions in our emails.',
      },
      contact: {
        title: 'Contact Us',
        description: 'If you have any questions about this privacy policy or how we handle your information, please contact us at <info@seemanchalsmartvyapaar.com>.',
      },
    },
    status: 'published',
    displayOrder: 1,
  },
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    content: {
      title: 'Terms of Service',
      description: 'By using our website and services, you agree to the following terms and conditions. Please read them carefully before engaging with our offerings.',
      useOfServices: 'You agree to use our services only for lawful purposes and in accordance with these terms. You are responsible for any content you submit and must not engage in any activity that could harm our business or reputation.',
      intellectualProperty: 'All content and materials on our website, including text, graphics, logos, and software, are the property of Seemanchal SmartVyapaar Consultancy and are protected by intellectual property laws. You may not use, reproduce, or distribute any content without our express written permission.',
      disclaimers: 'Our services are provided "as is" without any warranties. We do not guarantee that our services will be uninterrupted or error-free. We are not liable for any damages arising from the use of our services.',
      modifications: 'We reserve the right to modify these terms at any time. Any changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes your acceptance of the new terms.',
      contact: 'If you have any questions about these terms of service, please contact us at <support@seemanchalsmartvyapaar.com>.',
    },
    status: 'published',
    displayOrder: 2,
  },
];

const sampleOpenings = [
  {
    title: 'Frontend Developer Intern',
    department: 'Engineering',
    employmentType: 'INTERNSHIP',
    location: 'Remote / Hybrid',
    experience: 'Student / Fresher',
    description: 'Learn and build modern, responsive, and production-ready web interfaces using industry-standard frontend technologies under professional mentorship and real-world project training.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Next.js', 'TailwindCSS', 'Responsive Design'],
    displayOrder: 1,
    status: 'published',
  },
  {
    title: 'Backend Developer Intern',
    department: 'Backend Engineering',
    employmentType: 'INTERNSHIP',
    location: 'Remote',
    experience: 'Student / Fresher',
    description: 'Work on APIs, authentication systems, databases, and scalable backend architectures while gaining practical exposure to professional software development workflows.',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'MySQL', 'REST API', 'Authentication', 'Cloud Basics'],
    displayOrder: 2,
    status: 'published',
  },
  {
    title: 'Full Stack Developer Intern',
    department: 'Full Stack Engineering',
    employmentType: 'INTERNSHIP',
    location: 'Remote / Hybrid',
    experience: 'Student / Fresher',
    description: 'Gain hands-on experience in both frontend and backend development by building complete full stack applications, dashboards, and real-world industry projects.',
    skills: ['React.js', 'Next.js', 'Node.js', 'MongoDB', 'Express.js', 'REST APIs', 'Git & GitHub'],
    displayOrder: 3,
    status: 'published',
  },
  {
    title: 'UI/UX Design Intern',
    department: 'Design',
    employmentType: 'INTERNSHIP',
    location: 'Remote',
    experience: 'Student / Fresher',
    description: 'Learn professional UI/UX design principles, wireframing, prototyping, and modern design systems while contributing to real client and product interfaces.',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'Design Systems', 'User Research', 'Responsive UI', 'Creative Thinking'],
    displayOrder: 4,
    status: 'published',
  },
];

const sampleCommunityItems = [
  {
    type: 'GROUP',
    title: 'Developers Community',
    description: 'Collaborate on full-stack projects, SaaS systems, ERP platforms, AI tools, and production-grade applications.',
    metadata: {
      tags: ['React', 'Next.js', 'Node.js', 'AI'],
      icon: 'Code2',
    },
    displayOrder: 1,
    status: 'published',
  },
  {
    type: 'GROUP',
    title: 'Startup Ecosystem',
    description: 'Connect with founders, builders, and entrepreneurs working on scalable startup ideas and digital infrastructure.',
    metadata: {
      tags: ['Startups', 'SaaS', 'Growth', 'Innovation'],
      icon: 'Rocket',
    },
    displayOrder: 2,
    status: 'published',
  },
  {
    type: 'GROUP',
    title: 'Student Network',
    description: 'Learn modern development, participate in internships, workshops, and real-world projects.',
    metadata: {
      tags: ['Learning', 'Internships', 'Hackathons'],
      icon: 'GraduationCap',
    },
    displayOrder: 3,
    status: 'published',
  },
  {
    type: 'GROUP',
    title: 'Business Community',
    description: 'Help businesses adopt digital systems, ERP solutions, automation workflows, and scalable technology.',
    metadata: {
      tags: ['ERP', 'Automation', 'Digital Growth'],
      icon: 'Building2',
    },
    displayOrder: 4,
    status: 'published',
  },
  {
    type: 'WORKSHOP',
    title: 'Full Stack Development Bootcamp',
    description: 'A practical session for founders on building scalable digital systems, marketing workflows, and customer acquisition plans.',
    metadata: {
      date: 'June 2026',
      eventType: 'Workshop',
    },
    displayOrder: 5,
    status: 'published',
  },
  {
    type: 'EVENT',
    title: 'Regional Startup Networking Meetup',
    description: 'A practical session for founders on building scalable digital systems, marketing workflows, and customer acquisition plans.',
    metadata: {
      date: 'July 2026',
      eventType: 'Community Event',
    },
    displayOrder: 6,
    status: 'published',
  },
  {
    type: 'EVENT',
    title: 'AI & Automation Session',
    description: 'A practical session for founders on building scalable digital systems, marketing workflows, and customer acquisition plans.',
    metadata: {
      date: 'July 2026',
      eventType: 'Tech Talk',
    },
    displayOrder: 7,
    status: 'published',
  },
];

const roles = [
  { name: 'SUPER_ADMIN', description: 'Full administrative access to all CMS, security, and platform operations.' },
  { name: 'CONTENT_MANAGER', description: 'Can manage content, services, projects, homepage, community content, and media.' },
  { name: 'HR_MANAGER', description: 'Can manage job openings and HR-related operational data.' },
  { name: 'MARKETING_MANAGER', description: 'Can review leads and read marketing-facing CMS content.' },
  { name: 'admin', description: 'Legacy full-access administrative role retained for backward compatibility.' },
  { name: 'editor', description: 'Legacy limited CMS editing role retained for backward compatibility.' },
];

const permissions = Array.from(
  new Set(Object.values(ROLE_PERMISSIONS).flat().concat([
    'CMS_MANAGE_PAGES',
    'CMS_MANAGE_OPENINGS',
    'CMS_MANAGE_COMMUNITY',
  ]))
).map((name) => ({ name, description: `Permission: ${name}` }));

exports.up = async () => {
  for (const setting of settings) {
    await Setting.findOrCreate({
      where: { key: setting.key },
      defaults: setting,
    });
  }

  for (const page of contentPages) {
    const existingPage = await ContentPage.findOne({ where: { slug: page.slug } });
    if (existingPage) {
      await existingPage.update(page);
    } else {
      await ContentPage.create(page);
    }
  }

  for (const opening of sampleOpenings) {
    const existingOpening = await JobOpening.findOne({
      where: { title: opening.title, department: opening.department },
    });
    if (existingOpening) {
      await existingOpening.update(opening);
    } else {
      await JobOpening.create(opening);
    }
  }

  for (const item of sampleCommunityItems) {
    const existingItem = await CommunityItem.findOne({
      where: { title: item.title, type: item.type },
    });
    if (existingItem) {
      await existingItem.update(item);
    } else {
      await CommunityItem.create(item);
    }
  }

  const persistedRoles = {};
  for (const role of roles) {
    const [record] = await Role.findOrCreate({
      where: { name: role.name },
      defaults: role,
    });
    persistedRoles[role.name] = record;
  }

  const persistedPermissions = {};
  for (const permission of permissions) {
    const [record] = await Permission.findOrCreate({
      where: { name: permission.name },
      defaults: permission,
    });
    persistedPermissions[permission.name] = record;
  }

  const adminRole = persistedRoles.admin;
  if (adminRole) {
    for (const permission of Object.values(persistedPermissions)) {
      await RolePermission.findOrCreate({
        where: { roleId: adminRole.id, permissionId: permission.id },
      });
    }
  }

  for (const [roleName, permissionNames] of Object.entries(ROLE_PERMISSIONS)) {
    const role = persistedRoles[roleName];
    if (!role) continue;

    for (const permissionName of permissionNames) {
      const permission = persistedPermissions[permissionName];
      if (!permission) continue;
      await RolePermission.findOrCreate({
        where: { roleId: role.id, permissionId: permission.id },
      });
    }
  }

  const adminEmail = process.env.ADMIN_LOGIN_EMAIL || process.env.ADMIN_EMAIL;
  if (adminEmail && process.env.ADMIN_PASSWORD_HASH && persistedRoles.SUPER_ADMIN) {
    const [adminUser, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        name: 'SSC Admin',
        email: adminEmail,
        passwordHash: process.env.ADMIN_PASSWORD_HASH,
        role: 'admin',
        roleId: persistedRoles.SUPER_ADMIN.id,
        status: 'ACTIVE',
        passwordChangedAt: new Date(),
      },
    });

    if (!created && !adminUser.roleId) {
      await adminUser.update({ roleId: persistedRoles.SUPER_ADMIN.id, status: 'ACTIVE' });
    }
  }
};

exports.down = async () => {
  await Setting.destroy({ where: { key: settings.map((setting) => setting.key) } });

  const roleRecords = await Role.findAll({ where: { name: roles.map((role) => role.name) } });
  for (const role of roleRecords) {
    await RolePermission.destroy({ where: { roleId: role.id } });
  }

  await Permission.destroy({ where: { name: permissions.map((permission) => permission.name) } });
  await Role.destroy({ where: { name: roles.map((role) => role.name) } });
  await CommunityItem.destroy({ where: { title: sampleCommunityItems.map((item) => item.title) } });
  await JobOpening.destroy({ where: { title: sampleOpenings.map((opening) => opening.title) } });
  await ContentPage.destroy({ where: { slug: contentPages.map((page) => page.slug) } });
};
