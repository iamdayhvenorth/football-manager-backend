const User = require("../models/user/userModel")
const validateUser = require("../validators/userValidator")
const Role = require("../models/user/role")

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { error } = validateUser.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { error } = validateUser.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserRoles = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('roles');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user.roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignRole = async (req, res) => {
  try {
    const { error } = roleSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const role = new Role(req.body);
    await role.save();
    user.roles.push(role);
    await user.save();

    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.roles.pull(req.params.roleId);
    await user.save();

    res.status(200).json({ message: 'Role removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserActivity = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user.activityLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const criteria = req.query;
    const users = await User.find(criteria);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserRoles,
  assignRole,
  removeRole,
  getUserActivity,
  searchUsers
};