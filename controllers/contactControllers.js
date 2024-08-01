const Contact = require("../models/contact");
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contacts/contact");
const{ contactSchema,noteSchema,activitySchema }= require("../validators/contactValidators")

const listContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

const createContact = asyncHandler(async (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }

  const contact = new Contact(req.body);
  await contact.save();
  res.status(201).json(contact);
});

const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  res.json(contact);
});

const updateContact = asyncHandler(async (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }

  const contact = await Contact.findByIdAndUpdate(
    req.params.contactId,
    req.body,
    { new: true }
  );
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  res.json(contact);
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  res.json({ message: "Contact deleted" });
});

const listNotes = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  res.json(contact.notes);
});

const addNote = asyncHandler(async (req, res) => {
  const { error } = noteSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }

  const contact = await Contact.findById(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  contact.notes.push(req.body);
  await contact.save();
  res.status(201).json(contact.notes);
});

const listActivities = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  res.json(contact.activities);
});

const addActivity = asyncHandler(async (req, res) => {
  const { error } = activitySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }

  const contact = await Contact.findById(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  contact.activities.push(req.body);
  await contact.save();
  res.status(201).json(contact.activities);
});

const searchContacts = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.query;
  const criteria = {};
  if (name) criteria.name = new RegExp(name, "i");
  if (email) criteria.email = new RegExp(email, "i");
  if (phone) criteria.phone = new RegExp(phone, "i");

  const contacts = await Contact.find(criteria);
  res.json(contacts);
});
