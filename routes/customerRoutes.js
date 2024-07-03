const express = require('express');
const router = express.Router();


router
  .route('/')
  .post()
  .get()

router
  .route('/:customersId')
  .get()
  .put()
  .delete()

router
  .route('/search')
  .get()

router
  .route('/:customerId/contacts')
  .get()
  .post()

router
  .route('/:customerId/contacts/:contactId')
  .put()
  .delete()

module.exports = router;