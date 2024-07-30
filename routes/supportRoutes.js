const express = require('express');
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

router.route('/').get(getTickets).post(createTicket);

router
  .route('/:ticketId')
  .get(getTicketById)
  .put(updateTicket)
  .delete(deleteTicket);

router.route('/:ticketId/comments').get(getComments).post(addComment);

router
  .route('/ticketId/comments/:commentId')
  .put(updateComment)
  .delete(deleteComment);

module.exports = router;
