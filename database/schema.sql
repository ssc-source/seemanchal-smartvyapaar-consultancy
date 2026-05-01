-- =====================================================
-- SSC Website Production Schema
-- MySQL 8 Compatible Schema for Hostinger Deployment
-- =====================================================
--
-- IMPORTANT NOTES:
-- - This schema is generated from Sequelize models in backend/models/
-- - Admin user is NOT seeded here. Create admin manually after import.
-- - JWT/env authentication still required for admin access.
-- - Use utf8mb4 charset for full Unicode support.
-- - InnoDB engine for transactions and foreign keys.
--
-- Import Order: Run this file directly in Hostinger MySQL.
-- No Sequelize sync() required in production.
--
-- Generated on: 2026-05-02
-- =====================================================

-- Drop tables in reverse dependency order (child tables first)
DROP TABLE IF EXISTS Leads;
DROP TABLE IF EXISTS ContactSubmissions;
DROP TABLE IF EXISTS Media;
DROP TABLE IF EXISTS BlogPosts;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Projects;
DROP TABLE IF EXISTS Services;
DROP TABLE IF EXISTS Testimonials;
DROP TABLE IF EXISTS HomepageSections;
DROP TABLE IF EXISTS Settings;
DROP TABLE IF EXISTS Users;

-- Create parent tables first
CREATE TABLE Users (
  id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') DEFAULT 'editor',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Services (
  id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  shortDescription TEXT NOT NULL,
  fullDescription TEXT,
  icon VARCHAR(255),
  modules JSON DEFAULT ('[]'),
  idealFor JSON DEFAULT ('[]'),
  outcomes JSON DEFAULT ('[]'),
  isActive TINYINT(1) DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Categories (
  id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY name (name),
  UNIQUE KEY slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create dependent tables
CREATE TABLE Projects (
  id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  clientName VARCHAR(255),
  summary TEXT NOT NULL,
  businessType VARCHAR(255),
  problem TEXT,
  solution TEXT,
  outcome TEXT,
  tools JSON DEFAULT ('[]'),
  featuredImage VARCHAR(255),
  category VARCHAR(255),
  href VARCHAR(255),
  isActive TINYINT(1) DEFAULT 1,
  serviceId CHAR(36),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY slug (slug),
  KEY serviceId (serviceId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Testimonials (
  id CHAR(36) NOT NULL,
  clientName VARCHAR(255) NOT NULL,
  clientRole VARCHAR(255),
  companyName VARCHAR(255),
  content TEXT NOT NULL,
  context VARCHAR(255),
  rating INT DEFAULT 5,
  avatarUrl VARCHAR(255),
  isActive TINYINT(1) DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Settings (
  settingKey VARCHAR(255) NOT NULL,
  settingValue TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (settingKey)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE HomepageSections (
  id CHAR(36) NOT NULL,
  sectionKey VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  content JSON DEFAULT ('{}'),
  isActive TINYINT(1) DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY sectionKey (sectionKey)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Leads (
  id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  company VARCHAR(255),
  serviceOfInterest VARCHAR(255),
  message TEXT,
  status ENUM('new', 'contacted', 'qualified', 'closed', 'lost') DEFAULT 'new',
  source VARCHAR(255) DEFAULT 'direct',
  campaign VARCHAR(255),
  medium VARCHAR(255),
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ContactSubmissions (
  id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  message TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Media (
  id CHAR(36) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  originalName VARCHAR(255) NOT NULL,
  mimeType VARCHAR(255) NOT NULL,
  size INT NOT NULL,
  path VARCHAR(255) NOT NULL,
  altText VARCHAR(255),
  uploadedBy CHAR(36),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY uploadedBy (uploadedBy)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE BlogPosts (
  id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featuredImage VARCHAR(255),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  publishedAt DATETIME,
  categoryId CHAR(36),
  authorId CHAR(36),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY slug (slug),
  KEY categoryId (categoryId),
  KEY authorId (authorId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key constraints
ALTER TABLE Projects ADD CONSTRAINT fk_projects_service FOREIGN KEY (serviceId) REFERENCES Services (id) ON DELETE SET NULL;
ALTER TABLE Media ADD CONSTRAINT fk_media_user FOREIGN KEY (uploadedBy) REFERENCES Users (id) ON DELETE SET NULL;
ALTER TABLE BlogPosts ADD CONSTRAINT fk_blogposts_category FOREIGN KEY (categoryId) REFERENCES Categories (id) ON DELETE SET NULL;
ALTER TABLE BlogPosts ADD CONSTRAINT fk_blogposts_author FOREIGN KEY (authorId) REFERENCES Users (id) ON DELETE SET NULL;