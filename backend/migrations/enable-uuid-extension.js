module.exports = async (sequelize) => {

  try {
    await sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    console.log('UUID extension enabled');
  } catch (error) {
    console.error('Failed to enable UUID extension', error);
    throw error;
  }
};