const sequelize = require('../config/database');
const Lead = require('./Lead');
const Service = require('./Service');
const Project = require('./Project');
const Testimonial = require('./Testimonial');
const Setting = require('./Setting');
const ContactSubmission = require('./ContactSubmission');
const Media = require('./Media');
const Category = require('./Category');
const BlogCategory = require('./BlogCategory');
const BlogTag = require('./BlogTag');
const BlogPostTag = require('./BlogPostTag');
const BlogRevision = require('./BlogRevision');
const BlogPost = require('./BlogPost');
const User = require('./User');
const HomepageSection = require('./HomepageSection');
const ContentPage = require('./ContentPage');
const JobOpening = require('./JobOpening');
const CommunityItem = require('./CommunityItem');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const AuditLog = require('./AuditLog');
const SeoMetadata = require('./SeoMetadata');
const InternshipApplication = require('./InternshipApplication');
const InternshipBatch = require('./InternshipBatch');
const InternshipNote = require('./InternshipNote');
const InternshipHistory = require('./InternshipHistory');
const StudentProfile = require('./StudentProfile');
const Certificate = require('./Certificate');
const QuizExam = require('./QuizExam');
const QuizQuestion = require('./QuizQuestion');
const QuizRegistration = require('./QuizRegistration');
const QuizAttempt = require('./QuizAttempt');
const LeadAssignment = require('./LeadAssignment');
const LeadNote = require('./LeadNote');
const LeadHistory = require('./LeadHistory');
const FutureSkillInquiry = require('./FutureSkillInquiry');
const FutureSkillProgram = require('./FutureSkillProgram');
const FutureSkillWorkshop = require('./FutureSkillWorkshop');
const FutureSkillFAQ = require('./FutureSkillFAQ');
const FutureSkillTestimonial = require('./FutureSkillTestimonial');
const FutureSkillSuccessStory = require('./FutureSkillSuccessStory');

// Define Relationships

// Service <-> Project (One-to-Many)
Service.hasMany(Project, { foreignKey: 'serviceId' });
Project.belongsTo(Service, { foreignKey: 'serviceId' });

// BlogCategory <-> BlogPost (One-to-Many)
// blog_posts.categoryId references blog_categories as the current blog category relationship.
BlogCategory.hasMany(BlogPost, { foreignKey: 'categoryId' });
BlogPost.belongsTo(BlogCategory, { foreignKey: 'categoryId' });

// Legacy blog category association preserved for compatibility
BlogCategory.hasMany(BlogPost, { foreignKey: 'blogCategoryId', as: 'legacyBlogCategoryPosts' });
BlogPost.belongsTo(BlogCategory, { foreignKey: 'blogCategoryId', as: 'legacyBlogCategory' });

// BlogTag <-> BlogPost (Many-to-Many)
BlogPost.belongsToMany(BlogTag, { through: BlogPostTag, foreignKey: 'blogPostId', otherKey: 'blogTagId' });
BlogTag.belongsToMany(BlogPost, { through: BlogPostTag, foreignKey: 'blogTagId', otherKey: 'blogPostId' });

// BlogPost <-> BlogRevision (One-to-Many)
BlogPost.hasMany(BlogRevision, { foreignKey: 'blogPostId' });
BlogRevision.belongsTo(BlogPost, { foreignKey: 'blogPostId' });

// BlogRevision <-> BlogCategory (Optional category snapshot relationship)
BlogCategory.hasMany(BlogRevision, { foreignKey: 'categoryId' });
BlogRevision.belongsTo(BlogCategory, { foreignKey: 'categoryId' });

// User (Admin) <-> BlogPost (Author)
User.hasMany(BlogPost, { foreignKey: 'authorId' });
BlogPost.belongsTo(User, { foreignKey: 'authorId' });

// BlogPost <-> SeoMetadata
SeoMetadata.hasMany(BlogPost, { foreignKey: 'seoMetadataId' });
BlogPost.belongsTo(SeoMetadata, { foreignKey: 'seoMetadataId' });

// Role and Permission relationships
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'roleId',
  otherKey: 'permissionId',
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permissionId',
  otherKey: 'roleId',
});

User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

User.hasOne(StudentProfile, { foreignKey: 'userId' });
StudentProfile.belongsTo(User, { foreignKey: 'userId' });

AuditLog.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(AuditLog, { foreignKey: 'userId' });

// Internship management relationships
InternshipBatch.hasMany(InternshipApplication, {
  foreignKey: 'assignedBatchId',
  as: 'applications',
});
InternshipApplication.belongsTo(InternshipBatch, {
  foreignKey: 'assignedBatchId',
  as: 'assignedBatch',
});

InternshipBatch.hasMany(StudentProfile, { foreignKey: 'batchId' });
StudentProfile.belongsTo(InternshipBatch, { foreignKey: 'batchId' });

StudentProfile.hasMany(InternshipApplication, { foreignKey: 'studentProfileId' });
InternshipApplication.belongsTo(StudentProfile, { foreignKey: 'studentProfileId' });

StudentProfile.hasMany(Certificate, { foreignKey: 'studentId' });
Certificate.belongsTo(StudentProfile, { foreignKey: 'studentId' });

// Internship notes and history
InternshipApplication.hasMany(InternshipNote, { foreignKey: 'applicationId' });
InternshipNote.belongsTo(InternshipApplication, { foreignKey: 'applicationId' });
InternshipApplication.hasMany(InternshipHistory, { foreignKey: 'applicationId' });
InternshipHistory.belongsTo(InternshipApplication, { foreignKey: 'applicationId' });
User.hasMany(InternshipNote, { foreignKey: 'userId' });
InternshipNote.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(InternshipHistory, { foreignKey: 'userId' });
InternshipHistory.belongsTo(User, { foreignKey: 'userId' });

// Quiz platform relationships
QuizExam.hasMany(QuizQuestion, { foreignKey: 'quizExamId' });
QuizQuestion.belongsTo(QuizExam, { foreignKey: 'quizExamId' });

QuizExam.hasMany(QuizRegistration, { foreignKey: 'quizExamId' });
QuizRegistration.belongsTo(QuizExam, { foreignKey: 'quizExamId' });

StudentProfile.hasMany(QuizRegistration, { foreignKey: 'studentId' });
QuizRegistration.belongsTo(StudentProfile, { foreignKey: 'studentId' });

QuizRegistration.hasMany(QuizAttempt, { foreignKey: 'quizRegistrationId', as: 'attempts' });
QuizAttempt.belongsTo(QuizRegistration, { foreignKey: 'quizRegistrationId' });

// Lead CRM relationships
Lead.hasMany(LeadAssignment, { foreignKey: 'leadId' });
LeadAssignment.belongsTo(Lead, { foreignKey: 'leadId' });
Lead.hasMany(LeadNote, { foreignKey: 'leadId' });
LeadNote.belongsTo(Lead, { foreignKey: 'leadId' });
Lead.hasMany(LeadHistory, { foreignKey: 'leadId' });
LeadHistory.belongsTo(Lead, { foreignKey: 'leadId' });

User.hasMany(LeadAssignment, { foreignKey: 'assignedTo', as: 'assignedLeadTasks' });
LeadAssignment.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedToUser' });
User.hasMany(LeadAssignment, { foreignKey: 'assignedBy', as: 'createdLeadAssignments' });
LeadAssignment.belongsTo(User, { foreignKey: 'assignedBy', as: 'assignedByUser' });
User.hasMany(LeadNote, { foreignKey: 'userId' });
LeadNote.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Lead,
  Service,
  Project,
  Testimonial,
  Setting,
  ContactSubmission,
  Media,
  Category,
  BlogCategory,
  BlogTag,
  BlogPostTag,
  BlogRevision,
  BlogPost,
  User,
  HomepageSection,
  ContentPage,
  SeoMetadata,
  JobOpening,
  CommunityItem,
  InternshipApplication,
  InternshipBatch,
  InternshipNote,
  InternshipHistory,
  StudentProfile,
  Certificate,
  QuizExam,
  QuizQuestion,
  QuizRegistration,
  QuizAttempt,
  LeadAssignment,
  LeadNote,
  LeadHistory,
  Role,
  Permission,
  RolePermission,
  AuditLog,
  FutureSkillInquiry,
  FutureSkillProgram,
  FutureSkillWorkshop,
  FutureSkillFAQ,
  FutureSkillTestimonial,
  FutureSkillSuccessStory,
};
