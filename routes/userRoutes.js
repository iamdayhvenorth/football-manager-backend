const express = require('express');
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserRoles,
  assignRole,
  removeRole,
  getUserActivity,
  searchUsers,
} = require('../controllers/userManagementController');

const router = express.Router();

router.route('/').get(getUsers).post(createUser);

router
  .route('/:userId')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router.route('/:userId/roles').get(getUserRoles).post(assignRole);

router.get('/search', searchUsers);
router.delete('/:userId/roles/:roleId', removeRole);
router.get('/:userId/activity', getUserActivity);

module.exports = router;
