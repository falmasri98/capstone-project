const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const pool = require("../db");
const secretKey = "ZhQrZ951";

const addNewAdmin = async (req, res, next) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const role = "admin";

    const checkEmail = await pool.query(
      "SELECT email FROM admin where email = $1",
      [email]
    );

    if (checkEmail.rows.length == 0) {
      // let hashedPassword;
      // try {
      //   hashedPassword = await bcrypt.hash(password, 12);
      // } catch (err) {
      //   const error = new HttpError(
      //     "Could not create account, please try again.",
      //     500
      //   );
      //   return next(error);
      // }

      const all_records = await pool.query(
        "INSERT INTO admin (email, password, username, role) VALUES($1, $2, $3 , $4) RETURNING *",
        [email, password, username, role]
      );

      //Add JWT token
      let token;
      try {
        token = jwt.sign({ username: username, email: email }, secretKey, {
          expiresIn: "1h",
        });
      } catch (err) {
        const error = new HttpError(
          "Signing up failed, please try again.",
          500
        );
        return next(error);
      }

      all_records.rows[0].token = token;

      res.json(all_records.rows);
    } else {
      const error = new HttpError(
        "Email exist already, please login instead.",
        422
      );
      return next(error);
    }
  } catch (err) {
    console.log(err);
  }
};

const adminLogin = async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  let isValid = false;
  let checkEmail;

  try {
    checkEmail = await pool.query(
      "SELECT * FROM admin where email = $1 AND password = $2",
      [email, password]
    );

    if (checkEmail.rows.length == 0) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        403
      );
      return next(error);
    } else {
      isValid = true;
    }
  } catch (err) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  //Add JWT token
  let token;
  try {
    token = jwt.sign({ email: email }, secretKey, {
      expiresIn: "1h",
    });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again.", 500);
    return next(error);
  }

  checkEmail.rows[0].token = token;
  res.json(checkEmail.rows);
};

const getAdmins = async (req, res, next) => {
  try {
    const all_records = await pool.query("SELECT * FROM admin");
    res.json(all_records.rows);
  } catch (err) {
    const error = new HttpError(
      "Could not fetch admins list, please try again.",
      500
    );
    return next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  let adminId = req.params.adminId;
  try {
    const result = await pool.query("DELETE FROM admin WHERE id = $1", [
      adminId,
    ]);

    if (result) res.json({ adminDeleted: true });
  } catch (err) {
    const error = new HttpError(
      "Could not delete admin, please try again.",
      500
    );
    return next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const all_records = await pool.query("SELECT * FROM users");
    res.json(all_records.rows);
  } catch (err) {
    const error = new HttpError(
      "Could not fetch users list, please try again.",
      500
    );
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  let userId = req.params.userId;
  try {
    // const result = await pool.query("DELETE FROM users WHERE id = $1", [
    //   userId,
    // ]);

    const result = await pool.query(
      "UPDATE users SET status = $1 WHERE id = $2",
      ["deleted", userId]
    );

    if (result) res.json({ userDeleted: true });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Could not delete user, please try again.",
      500
    );
    return next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  let userId = req.params.userId;
  let newRole = req.body.role;

  try {
    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2",
      [newRole, userId]
    );
    if (result) res.json({ roleUpdated: true });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Could not update user role, please try again.",
      500
    );
    return next(error);
  }
};

// Approve provider

const approveProvider = async (req, res, next) => {
  let providerId = req.params.providerId;
  try {
    const result = await pool.query(
      "UPDATE users SET status = 'confirmed' WHERE id = $1",
      [providerId]
    );

    if (result) res.json({ providerApproved: true });
  } catch (err) {
    const error = new HttpError(
      "Could not approve provider, please try again.",
      500
    );
    return next(error);
  }
};

const getAboutUsContent = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM aboutus");
    res.json(result.rows);
  } catch (err) {
    const error = new HttpError(
      "Could not fetch about us content, please try again.",
      500
    );
    return next(error);
  }
};

const getContactUsContent = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM contactus");
    res.json(result.rows);
  } catch (err) {
    const error = new HttpError(
      "Could not fetch contact us content, please try again.",
      500
    );
    return next(error);
  }
};

const updateAboutUsContent = async (req, res, next) => {
  let aboutUsText = req.body.aboutUsText;
  let whyChooseUs = req.body.whyChooseUs;

  try {
    if (aboutUsText && whyChooseUs) {
      let result = await pool.query(
        "UPDATE aboutus SET main_us_text = $1, why_choose_us = $2",
        [aboutUsText, whyChooseUs]
      );
      if (result) {
        res.json({ contentUpdated: true });
      }
    }
  } catch (err) {
    const error = new HttpError(
      "Could not update about us content, please try again.",
      500
    );
    return next(error);
  }
};

const updateContactUsContent = async (req, res, next) => {
  let ourLocation = req.body.ourLocation;
  let phoneNumber = req.body.phoneNumber;
  let email = req.body.email;

  try {
    let result = await pool.query(
      "UPDATE contactus SET our_location = $1, phonenumber = $2, email = $3",
      [ourLocation, phoneNumber, email]
    );
    if (result) {
      res.json({ contentUpdated: true });
    }
  } catch (err) {
    const error = new HttpError(
      "Could not update contact us content, please try again.",
      500
    );
    return next(error);
  }
};

const getAllServices = async (req, res, next) => {
  try {
    let result = await pool.query(
      "SELECT service.service_id AS id, service.*, users.username, users.email FROM service JOIN users ON service.provider_id = users.id"
    );
    if (result.rows.length > 0) res.json(result.rows);
  } catch (err) {
    const error = new HttpError(
      "Could not fetch services, please try again.",
      500
    );

    return next(error);
  }
};

const deleteService = async (req, res, next) => {
  let serviceId = req.params.serviceId;
  try {
    const result = await pool.query(
      "DELETE FROM service WHERE service_id = $1",
      [serviceId]
    );

    if (result) res.json({ orderDeleted: true });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Could not delete service, please try again.",
      500
    );
    return next(error);
  }
};

const confirmService = async (req, res, next) => {
  let serviceId = req.params.serviceId;
  try {
    const result = await pool.query(
      "UPDATE service SET status = 'confirmed' WHERE service_id = $1",
      [serviceId]
    );

    if (result) res.json({ orderDeleted: true });
  } catch (err) {
    const error = new HttpError(
      "Could not confirm service, please try again.",
      500
    );
    return next(error);
  }
};

const getUsersMessages = async (req, res, next) => {
  try {
    let result = await pool.query("SELECT * FROM users_feedback");

    if (result.rows.length > 0) res.json(result.rows);
  } catch (err) {
    const error = new HttpError(
      "Could not fetch messages, please try again.",
      500
    );

    return next(error);
  }
};

exports.addNewAdmin = addNewAdmin;
exports.adminLogin = adminLogin;
exports.getAdmins = getAdmins;
exports.deleteAdmin = deleteAdmin;
exports.getUsers = getUsers;
exports.updateUserRole = updateUserRole;
exports.deleteUser = deleteUser;
exports.getAboutUsContent = getAboutUsContent;
exports.getContactUsContent = getContactUsContent;
exports.updateAboutUsContent = updateAboutUsContent;
exports.updateContactUsContent = updateContactUsContent;
exports.getAllServices = getAllServices;
exports.deleteService = deleteService;
exports.confirmService = confirmService;
exports.getUsersMessages = getUsersMessages;
exports.approveProvider = approveProvider;
