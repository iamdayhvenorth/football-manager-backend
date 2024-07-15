const express = require('express');
const router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser")
const {
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
} = require("../controllers/customerController")


router
  .route('/')
  .post(authenticateUser, createCustomer)
  .get(authenticateUser, getAllCustomers)

router
  .route('/:customersId')
  .get(authenticateUser, getSingleCustomer )
  .put(authenticateUser, updateCustomer )
  .delete(authenticateUser, deleteCustomer)

router
  .route('/search')
  .get(authenticateUser, searchCustomers )

router
  .route('/:customerId/contacts')
  .get(authenticateUser, listContacts)
  .post(authenticateUser, addContact )

router
  .route('/:customerId/contacts/:contactId')
  .put(authenticateUser, updateContact )
  .delete(authenticateUser, deleteContact )

module.exports = router;