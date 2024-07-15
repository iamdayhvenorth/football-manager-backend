const validateCustomer = require('../validators/customerValidator.js');
const Customer = require('../models/customer/customerModel.js');
const Contact = require('../models/customer/contactModel.js');

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

// const getAllContacts = async (req, res) => {
//   try {
//     const { id: customerId } = req.params;
//     const contact = await Customer.findOne({ _id: customerId }).select(
//       'contact'
//     );
//     res.status(200).json({ contact });
//   } catch (error) {
//     throw new Error(error);
//   }
// };

const searchCustomers = async (req, res) => {
  try {
    const query = req.query.q;
    const customers = await Customer.find({ name: new RegExp(query, 'i') });
    res.status(200).json(customers);
  } catch (err) {
    throw new Error(err);
  }
};

const listContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ customerId: req.params.customerId });
    res.status(200).json(contacts);
  } catch (err) {
    throw new Error(err);
  }
};

const addContact = async (req, res) => {
  try {
    const contact = new Contact({
      ...req.body,
      customerId: req.params.customerId,
    });
    await contact.save();
    res.status(200).status(201).json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.contactId, customerId: req.params.customerId },
      req.body,
      { new: true }
    );
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.contactId,
      customerId: req.params.customerId,
    });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.status(200).json({ message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllCustomers,
  createCustomer,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
  // getAllContacts,
  searchCustomers,
  listContacts,
  addContact,
  updateContact,
  deleteContact,
};
