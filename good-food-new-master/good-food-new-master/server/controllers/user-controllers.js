const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const pool = require("../db");
const secretKey = "ZhQrZ951";

const registerUser = async (req, res, next) => {
  try {
    const username = req.body.username;
    const phone = req.body.phonenumber;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    const category = req.body.category;
    const menu = req.body.menuUrl;
    const accountStatus = "pending";
    const isSubscribed = false;
    let image;

    if (req?.file?.path) image = req.file.path;
    else image = null;

    const checkEmail = await pool.query(
      "SELECT email FROM users where email = $1",
      [email]
    );

    if (checkEmail.rows.length == 0) {
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 12);
      } catch (err) {
        const error = new HttpError(
          "Could not create account, please try again.",
          500
        );
        return next(error);
      }

      const all_records = await pool.query(
        "INSERT INTO users (username, email, password, phonenumber, role, image, status, subscribed, category, menu) VALUES($1, $2, $3 , $4 , $5, $6, $7, $8, $9, $10) RETURNING *",
        [
          username,
          email,
          hashedPassword,
          phone,
          role,
          image,
          accountStatus,
          isSubscribed,
          category,
          menu,
        ]
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

const userLogin = async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  let isValidPassword = false;
  let checkEmail;

  try {
    checkEmail = await pool.query("SELECT * FROM users where email = $1", [
      email,
    ]);

    if (checkEmail.rows.length == 0) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        403
      );
      return next(error);
    }

    try {
      isValidPassword = await bcrypt.compare(
        password,
        checkEmail.rows[0].password
      );
    } catch (err) {
      const error = new HttpError(
        "Could not log you in, please check your credentials and try again.",
        500
      );
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in....",
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

const getAllServices = async (req, res, next) => {
  let result;

  try {
    result = await pool.query(
      "SELECT service.* , users.* FROM service JOIN users ON users.id = service.provider_id"
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Can't fetch services, please try again.", 500);
    return next(error);
  }

  res.json(result.rows);
};

const getStoresList = async (req, res, next) => {
  try {
    const all_records = await pool.query(
      "SELECT * FROM users WHERE role = 'provider' AND status = 'confirmed'"
    );
    res.json(all_records.rows);
  } catch (err) {
    const error = new HttpError(
      "Could not fetch stores list, please try again.",
      500
    );
    return next(error);
  }
};

const addNewOrder = async (req, res, next) => {
  let bagId = req.body.bag_id;
  let userId = req.body.user_id;
  let orderDate = req.body.order_date;

  try {
    let result = await pool.query(
      "INSERT INTO orders (bag_id, user_id, order_date, order_status) VALUES($1, $2, $3, $4)",
      [bagId, userId, orderDate, "pending"]
    );

    if (result) {
      let updateService = await pool.query(
        "UPDATE service SET count = count - 1 WHERE service_id = $1",
        [bagId]
      );
      res.json({ bagAdded: true });
    }
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Could not create your order, please try again.",
      500
    );
    return next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  let userId = req.params.userId;

  try {
    let result = await pool.query(
      "SELECT Orders.id, Orders.order_date, Orders.order_status, Service.service_type, Service.service_category FROM orders INNER JOIN Service ON Orders.bag_id = Service.service_id WHERE Orders.user_id = $1 AND Orders.order_status <> 'deleted'",
      [userId]
    );
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    const error = new HttpError(
      "Could not fetch your orders, please try again.",
      500
    );
    return next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  let orderId = req.params.orderId;
  try {
    const result = await pool.query("DELETE FROM orders WHERE id = $1", [
      orderId,
    ]);

    if (result) res.json({ orderDeleted: true });
  } catch (err) {
    const error = new HttpError(
      "Could not delete order, please try again.",
      500
    );
    return next(error);
  }
};

const getUserDetails = async (req, res, next) => {
  let userId = req.params.userId;

  try {
    let result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    res.json(result.rows);
  } catch (err) {
    const error = new HttpError(
      "Could not fetch user details, please try again.",
      500
    );

    return next(error);
  }
};

const updateUserInfo = async (req, res, next) => {
  let userId = req.params.userId;
  let { email, username, phonenumber, password } = req.body;
  let existingEmail;

  try {
    existingEmail = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND id <> $2",
      [email, userId]
    );
  } catch (err) {
    const error = new HttpError(
      "Could not update your information, please try again.",
      500
    );

    return next(error);
  }

  if (existingEmail.rows.length > 0) {
    const error = new HttpError(
      "Email already been used, please enter different email address.",
      500
    );

    return next(error);
  } else {
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError(
        "Could not update account, please try again.",
        500
      );
      return next(error);
    }

    try {
      let result = pool.query(
        "UPDATE users SET email = $1, phonenumber = $2, username = $3, password = $4 WHERE id = $5",
        [email, phonenumber, username, hashedPassword, userId]
      );

      if (result) res.json({ userUpdated: true });
    } catch (err) {
      const error = new HttpError(
        "Could not update your information, please try again.",
        500
      );

      return next(error);
    }
  }
};

const confirmOrder = async (req, res, next) => {
  let orderId = req.params.orderId;
  try {
    const result = await pool.query(
      "UPDATE orders SET order_status = 'confirmed' WHERE id = $1",
      [orderId]
    );

    if (result) res.json({ orderDeleted: true });
  } catch (err) {
    const error = new HttpError(
      "Could not confirm order, please try again.",
      500
    );
    return next(error);
  }
};

const addFeedback = async (req, res, next) => {
  let { fullName, userEmail, userPhone, message } = req.body;
  let result;

  try {
    result = await pool.query(
      "INSERT INTO users_feedback (user_email, user_phone, user_name, message) VALUES ($1, $2, $3, $4)",
      [userEmail, userPhone, fullName, message]
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Could not add your feedback, please try again.",
      500
    );
    return next(error);
  }

  if (result) res.json({ feedbackAdded: true });
};

exports.registerUser = registerUser;
exports.userLogin = userLogin;
exports.getAllServices = getAllServices;
exports.getStoresList = getStoresList;
exports.addNewOrder = addNewOrder;
exports.getUserOrders = getUserOrders;
exports.deleteOrder = deleteOrder;
exports.confirmOrder = confirmOrder;
exports.getUserDetails = getUserDetails;
exports.updateUserInfo = updateUserInfo;
exports.addFeedback = addFeedback;
