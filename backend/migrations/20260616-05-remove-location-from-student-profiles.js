module.exports = {
  async up(queryInterface) {
    const table = 'student_profiles';
    try {
      const tableInfo = await queryInterface.describeTable(table);
      if (tableInfo.location) {
        await queryInterface.removeColumn(table, 'location');
        console.log('✓ Removed unused location column from student_profiles');
      }
    } catch (error) {
      // Table doesn't exist or column doesn't exist, skip
      console.log('location column does not exist in student_profiles, skipping removal');
    }
  },

  async down(queryInterface) {
    // No restoration needed - location was not a legitimate field for StudentProfile
  },
};
