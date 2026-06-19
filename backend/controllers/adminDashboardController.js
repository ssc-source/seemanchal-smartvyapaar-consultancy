const { Op } = require('sequelize');
const {
  InternshipApplication,
  InternshipBatch,
  StudentProfile,
  Certificate,
  QuizRegistration,
  QuizAttempt,
  User,
  Lead,
  sequelize,
} = require('../models');

exports.getMetrics = async (req, res) => {
  try {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    // Count applications by status - safely handle empty results
    let applicationsByStatus = {};
    try {
      const counts = await InternshipApplication.count({
        attributes: ['status'],
        group: ['status'],
        raw: true,
      });
      applicationsByStatus = counts.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {});
    } catch (error) {
      console.warn('Error fetching applications by status:', error.message);
      applicationsByStatus = {};
    }

    // Count total applications
    let totalApplications = 0;
    try {
      totalApplications = await InternshipApplication.count();
    } catch (error) {
      console.warn('Error counting total applications:', error.message);
    }

    // Count active interns
    let activeInterns = 0;
    try {
      activeInterns = await StudentProfile.count({
        where: { internshipStatus: 'IN_PROGRESS' },
      });
    } catch (error) {
      console.warn('Error counting active interns:', error.message);
    }

    // Count completed internships
    let completedInternships = 0;
    try {
      completedInternships = await StudentProfile.count({
        where: { internshipStatus: 'COMPLETED' },
      });
    } catch (error) {
      console.warn('Error counting completed internships:', error.message);
    }

    // Count active batches
    let activeBatches = 0;
    try {
      activeBatches = await InternshipBatch.count({
        where: { status: 'ACTIVE' },
      });
    } catch (error) {
      console.warn('Error counting active batches:', error.message);
    }

    // Count assessment registrations
    let assessmentRegistrations = 0;
    try {
      assessmentRegistrations = await QuizRegistration.count();
    } catch (error) {
      console.warn('Error counting assessment registrations:', error.message);
    }

    // Count completed assessments
    let completedAssessments = 0;
    try {
      completedAssessments = await QuizAttempt.count({
        where: { completedAt: { [Op.ne]: null } },
      });
    } catch (error) {
      console.warn('Error counting completed assessments:', error.message);
    }

    // Count certificates
    let certificatesIssued = 0;
    try {
      certificatesIssued = await Certificate.count();
    } catch (error) {
      console.warn('Error counting certificates:', error.message);
    }

    // Calculate pass percentage
    let passPercentage = 0;
    try {
      const passedAssessments = await QuizAttempt.count({
        where: { passed: true, completedAt: { [Op.ne]: null } },
      });
      passPercentage = completedAssessments > 0
        ? Math.round((passedAssessments / completedAssessments) * 100)
        : 0;
    } catch (error) {
      console.warn('Error calculating pass percentage:', error.message);
      passPercentage = 0;
    }

    // Revenue metrics - ensure sum returns 0 for null
    let todayRevenue = 0;
    try {
      const result = await QuizRegistration.sum('amount', {
        where: {
          paymentStatus: 'paid',
          paymentCompletedAt: {
            [Op.gte]: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            [Op.lt]: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
          },
        },
      });
      todayRevenue = result || 0;
    } catch (error) {
      console.warn('Error calculating today revenue:', error.message);
      todayRevenue = 0;
    }

    let monthRevenue = 0;
    try {
      const result = await QuizRegistration.sum('amount', {
        where: {
          paymentStatus: 'paid',
          paymentCompletedAt: {
            [Op.gte]: thisMonth,
          },
        },
      });
      monthRevenue = result || 0;
    } catch (error) {
      console.warn('Error calculating month revenue:', error.message);
      monthRevenue = 0;
    }

    let totalRevenue = 0;
    try {
      const result = await QuizRegistration.sum('amount', {
        where: { paymentStatus: 'paid' },
      });
      totalRevenue = result || 0;
    } catch (error) {
      console.warn('Error calculating total revenue:', error.message);
      totalRevenue = 0;
    }

    // Count pending reviews
    let pendingReviews = 0;
    try {
      pendingReviews = await InternshipApplication.count({
        where: { status: 'SCREENING' },
      });
    } catch (error) {
      console.warn('Error counting pending reviews:', error.message);
    }

    // Count failed assessments
    let failedAssessments = 0;
    try {
      failedAssessments = await QuizAttempt.count({
        where: { passed: false, completedAt: { [Op.ne]: null } },
      });
    } catch (error) {
      console.warn('Error counting failed assessments:', error.message);
    }

    res.json({
      success: true,
      data: {
        totalApplications,
        activeInterns,
        completedInternships,
        activeBatches,
        assessmentRegistrations,
        completedAssessments,
        certificatesIssued,
        passPercentage,
        todayRevenue: Math.round(todayRevenue),
        monthRevenue: Math.round(monthRevenue),
        totalRevenue: Math.round(totalRevenue),
        pendingReviews,
        failedStudents: failedAssessments,
        applicationsByStatus,
      },
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to calculate dashboard metrics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const activities = [];

    try {
      // Recent applications
      const recentApps = await InternshipApplication.findAll({
        where: {
          createdAt: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        order: [['createdAt', 'DESC']],
        limit: 5,
      });

      if (recentApps && Array.isArray(recentApps)) {
        activities.push(
          ...recentApps.map((app) => ({
            type: 'application',
            description: 'Application submitted',
            id: app.id,
            studentName: app.studentName,
            timestamp: app.createdAt,
          }))
        );
      }
    } catch (error) {
      console.warn('Error fetching recent applications:', error.message);
    }

    try {
      // Recent status changes
      const recentHistory = await sequelize.query(`
        SELECT * FROM internship_histories
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        ORDER BY created_at DESC
        LIMIT 5
      `, { type: sequelize.QueryTypes.SELECT });

      if (recentHistory && Array.isArray(recentHistory)) {
        activities.push(
          ...recentHistory.map((item) => ({
            type: 'status_change',
            description: `Student ${item.newStatus?.toLowerCase().replace(/_/g, ' ') || 'status changed'}`,
            id: item.id,
            studentName: 'Student',
            timestamp: item.createdAt,
          }))
        );
      }
    } catch (error) {
      console.warn('Error fetching recent history:', error.message);
    }

    try {
      // Recent assessments
      const recentAttempts = await QuizAttempt.findAll({
        where: {
          completedAt: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        order: [['completedAt', 'DESC']],
        limit: 5,
      });

      if (recentAttempts && Array.isArray(recentAttempts)) {
        activities.push(
          ...recentAttempts.map((attempt) => ({
            type: 'assessment',
            description: 'Assessment completed',
            id: attempt.id,
            studentName: 'Student',
            timestamp: attempt.completedAt,
          }))
        );
      }
    } catch (error) {
      console.warn('Error fetching recent assessments:', error.message);
    }

    try {
      // Recent certificates
      const recentCerts = await Certificate.findAll({
        where: {
          createdAt: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        order: [['createdAt', 'DESC']],
        limit: 5,
      });

      if (recentCerts && Array.isArray(recentCerts)) {
        activities.push(
          ...recentCerts.map((cert) => ({
            type: 'certificate',
            description: 'Certificate issued',
            id: cert.id,
            studentName: 'Student',
            timestamp: cert.createdAt,
          }))
        );
      }
    } catch (error) {
      console.warn('Error fetching recent certificates:', error.message);
    }

    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ success: true, data: activities.slice(0, 15) });
  } catch (error) {
    console.error('Recent activity error:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch recent activity',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

exports.getCharts = async (req, res) => {
  try {
    let applicationsPerMonth = [];
    let revenueTrend = [];
    let assessmentResults = { passed: 0, failed: 0 };
    let internshipStats = [];
    let certificateTrend = [];

    try {
      // Applications per month (last 12 months)
      const result = await sequelize.query(`
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          COUNT(*) as count
        FROM internship_applications
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month
      `, { type: sequelize.QueryTypes.SELECT });
      applicationsPerMonth = result || [];
    } catch (error) {
      console.warn('Error fetching applications per month:', error.message);
      applicationsPerMonth = [];
    }

    try {
      // Revenue trend (last 12 months)
      const result = await sequelize.query(`
        SELECT
          DATE_FORMAT(payment_completed_at, '%Y-%m') as month,
          SUM(amount) as revenue
        FROM quiz_registrations
        WHERE payment_status = 'paid'
        AND payment_completed_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(payment_completed_at, '%Y-%m')
        ORDER BY month
      `, { type: sequelize.QueryTypes.SELECT });
      revenueTrend = result || [];
    } catch (error) {
      console.warn('Error fetching revenue trend:', error.message);
      revenueTrend = [];
    }

    try {
      // Assessment pass/fail
      const result = await sequelize.query(`
        SELECT
          SUM(CASE WHEN passed = true THEN 1 ELSE 0 END) as passed,
          SUM(CASE WHEN passed = false THEN 1 ELSE 0 END) as failed
        FROM quiz_attempts
        WHERE completed_at IS NOT NULL
        AND completed_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)
      `, { type: sequelize.QueryTypes.SELECT });
      
      assessmentResults = {
        passed: result?.[0]?.passed || 0,
        failed: result?.[0]?.failed || 0,
      };
    } catch (error) {
      console.warn('Error fetching assessment results:', error.message);
      assessmentResults = { passed: 0, failed: 0 };
    }

    try {
      // Internship completion rate
      const result = await sequelize.query(`
        SELECT
          internship_status as status,
          COUNT(*) as count
        FROM student_profiles
        GROUP BY internship_status
      `, { type: sequelize.QueryTypes.SELECT });
      internshipStats = result || [];
    } catch (error) {
      console.warn('Error fetching internship stats:', error.message);
      internshipStats = [];
    }

    try {
      // Certificate issuance trend
      const result = await sequelize.query(`
        SELECT
          DATE_FORMAT(created_at, '%Y-%m') as month,
          COUNT(*) as count
        FROM certificates
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month
      `, { type: sequelize.QueryTypes.SELECT });
      certificateTrend = result || [];
    } catch (error) {
      console.warn('Error fetching certificate trend:', error.message);
      certificateTrend = [];
    }

    res.json({
      success: true,
      data: {
        applicationsPerMonth,
        revenueTrend,
        assessmentResults,
        internshipStats,
        certificateTrend,
      },
    });
  } catch (error) {
    console.error('Charts error:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch chart data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
