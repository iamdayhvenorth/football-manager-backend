const express = require('express');
const authenticateUser = require("../middlewares/authenticateUser")
const {
  getTickets,
  createTicket,
  getTicketById,
  updateTicket,
  deleteTicket,
  getComments,
  addComment,
  updateComment,
  deleteComment,
} = require('../controllers/supportController');

const router = express.Router();

router.route('/', authenticateUser,).get(authenticateUser, getTickets).post(authenticateUser, createTicket);

router
  .route('/:ticketId')
  .get(authenticateUser, getTicketById)
  .put(authenticateUser, updateTicket)
  .delete(authenticateUser, deleteTicket);

router
  .route('/:ticketId/comments')
  .get(authenticateUser, getComments)
  .post(authenticateUser, addComment);

router
  .route('/ticketId/comments/:commentId')
  .put(authenticateUser, updateComment)
  .delete(authenticateUser, deleteComment);

module.exports = router;
