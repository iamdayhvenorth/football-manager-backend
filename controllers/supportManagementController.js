const Ticket = require('../models/support/tickets');
const Comment = require('../models/support/comment');
const { ticketSchema, commentSchema } = require('../validators/supportValidator');

const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('comments');
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTicket = async (req, res) => {
  try {
    const { error } = ticketSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const ticket = new Ticket(req.body);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId).populate('comments');
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { error } = ticketSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const ticket = await Ticket.findByIdAndUpdate(req.params.ticketId, req.body, { new: true });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.ticketId);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId).populate('comments');
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.status(200).json(ticket.comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { error } = commentSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    const comment = new Comment({ ...req.body, ticket: req.params.ticketId });
    await comment.save();
    ticket.comments.push(comment);
    await ticket.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { error } = commentSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, { new: true });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const ticket = await Ticket.findById(req.params.ticketId);
    ticket.comments.pull(req.params.commentId);
    await ticket.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTickets,
  createTicket,
  getTicketById,
  updateTicket,
  deleteTicket,
  getComments,
  addComment,
  updateComment,
  deleteComment
};
