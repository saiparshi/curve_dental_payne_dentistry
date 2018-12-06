/**
 * Provides access to the database.
 * 
 * Storing the database as a global is required for testability with Jasmine and Wallaby.
 * This class prevents keeps the use of a global as an implemementation detail and keeps
 * the global from polluting other models.
 */
exports.getDatabase = () => {
  return global.db;
};
