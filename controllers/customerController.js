const validateCustomer = require('../validators/customerValidator.js');
const Customer = require('../models/customerModel.js');

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.status(200).json({ customers });
  } catch (error) {
    throw new Error(error);
  }
};

const createCustomer = async (req, res) => {
  try {
    const { error, value } = validateCustomer.validate({ ...req.body });
    if (!value) throw new Error('Please Provide Customer Details');
    // req.body.user = req.user.userId;
    const customer = await Customer.create(value);
    res.status(200).json({ customer });
  } catch (error) {
    throw new Error(error);
  }
};

const getSingleCustomer = async (req, res) => {
  try {
    const { id: customerId } = req.params;
    const customer = await Customer.findOne({ _id: customerId });
    if (!customer) {
      throw new Error(`No customer with id : ${customerId}`);
    }
    res.status(200).json({ customer });
  } catch (error) {
    throw new Error(error);
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id: customerId } = req.params;
    const { error, value } = validateCustomer.validate({ ...req.body });
    if (!value) throw new Error('Please Provide Customer Details');
    const customer = await Customer.findOneAndUpdate(
      { _id: customerId },
      value,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!customer) {
      throw new Error(`No Customer with id : ${customerId}`);
    }
    res.status(200).json({ customer });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id: customerId } = req.params;
    const customer = await Customer.findOne({ _id: customerId });
    if (!customer) {
      throw new Error(`No Customer with id : ${customerId}`);
    }
    await customer.remove();
    res.status(200).json({ msg: 'Success! Customer removed.' });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getAllCustomers,
  createCustomer,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
};
