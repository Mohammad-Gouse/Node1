// Define callback functions for API routes
const getUsers = async (ctx) => {
    // Fetch and return a list of users
    // ctx.body = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
    // ctx.body='hello';
    ctx.body = {
      status: 200,
      message: "test hai bhai"
    }
  };

  // Export the callback functions
module.exports = {
    getUsers
};