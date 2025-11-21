import validator from "validator";

export const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName) {
    throw new Error("Name is Missing");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter Strong Password");
  }
};

export const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "about",
    "photoUrl",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) => {
    return allowedEditFields.includes(field);
  });

  return isEditAllowed;
};
