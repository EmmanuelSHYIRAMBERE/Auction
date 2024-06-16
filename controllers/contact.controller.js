import Contact from "../models/contact.model";
import errorHandler, { catchAsyncError } from "../utils/errorhandler.utlity";
import { contactsValidationSchema } from "../validation/data.validation";

export const createContact = catchAsyncError(async (req, res, next) => {
  const { error } = contactsValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(", ");
    return next(new errorHandler(errorMessage, 400));
  }

  const { firstname, lastname, email, address } = req.body;

  const newContact = await Contact.create({
    firstname,
    lastname,
    email,
    address,
  });

  res.status(201).json({
    message: "Contact created successfully.",
    contact: newContact,
  });
});

export const getContactById = catchAsyncError(async (req, res, next) => {
  const contactId = req.params.id;

  const contact = await Contact.findById(contactId);

  if (!contact) {
    return next(new errorHandler(`Contact not found`, 404));
  }

  res.status(200).json({ message: "Contact found successfully", contact });
});

export const updateContact = catchAsyncError(async (req, res, next) => {
  const contactId = req.params.id;

  const { firstname, lastname, email, address } = req.body;

  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { firstname, lastname, email, address },
    { new: true }
  );

  if (!updatedContact) {
    return next(new errorHandler(`Contact not found`, 404));
  }

  res.status(200).json({
    message: "Contact updated successfully",
    updatedContact,
  });
});

export const deleteContact = catchAsyncError(async (req, res, next) => {
  const contactId = req.params.id;

  const deletedContact = await Contact.findByIdAndDelete(contactId);

  if (!deletedContact) {
    return next(new errorHandler(`Contact not found`, 404));
  }

  res
    .status(200)
    .json({ message: "Contact deleted successfully", deletedContact });
});

export const getAllContacts = catchAsyncError(async (req, res, next) => {
  const allContacts = await Contact.find();

  if (allContacts.length === 0 || !allContacts) {
    return next(new errorHandler(`Contacts not found`, 404));
  }

  res.status(200).json({
    message: "Contacts found successfully",
    totalContacts: allContacts.length,
    contacts: allContacts,
  });
});
