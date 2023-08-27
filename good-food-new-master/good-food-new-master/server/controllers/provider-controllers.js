const bcrypt = require("bcrypt");
const HttpError = require("../models/http-error");
const pool = require("../db");

const addNewSurpriseBag = async (req, res, next) => {
  let serviceType = req.body.serviceType;
  let serviceCategory = req.body.serviceCategory;
  let providerId = req.body.providerId;
  let result;

  try {
    let isServiceExist = await pool.query(
      "SELECT * FROM service WHERE service_type = $1 AND service_category = $2 AND provider_id = $3",
      [serviceType, serviceCategory, providerId]
    );

    if (isServiceExist.rows.length === 0) {
      result = await pool.query(
        "INSERT INTO service (service_type, service_category, provider_id) VALUES($1, $2, $3)",
        [serviceType, serviceCategory, providerId]
      );
    } else {
      result = await pool.query(
        "UPDATE service SET count = count + 1 WHERE service_type = $1 AND service_category = $2 AND provider_id = $3",
        [serviceType, serviceCategory, providerId]
      );
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Could not add surprise bag, please try again.",
      500
    );

    return next(error);
  }

  res.json({ serviceAdded: true });
};

const updateProviderInfo = async (req, res, next) => {
  let providerId = req.params.providerId;
  let { email, username, phonenumber, password } = req.body;
  let existingEmail;

  try {
    existingEmail = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND id <> $2",
      [email, providerId]
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
      console.log(err);
      const error = new HttpError(
        "Could not update account, please try again.",
        500
      );
      return next(error);
    }

    try {
      let result = pool.query(
        "UPDATE users SET email = $1, phonenumber = $2, username = $3, password = $4 WHERE id = $5",
        [email, phonenumber, username, hashedPassword, providerId]
      );

      if (result) res.json({ providerUpdated: true });
    } catch (err) {
      const error = new HttpError(
        "Could not update your information, please try again.",
        500
      );

      return next(error);
    }
  }
};

const getProviderServices = async (req, res, next) => {
  let providerId = req.params.providerId;

  try {
    let result = await pool.query(
      "SELECT * FROM service WHERE provider_id = $1",
      [providerId]
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

const getProviderDetails = async (req, res, next) => {
  let providerId = req.params.providerId;

  try {
    let result = await pool.query("SELECT * FROM users WHERE id = $1", [
      providerId,
    ]);
    if (result.rows.length > 0) res.json(result.rows);
  } catch (err) {
    const error = new HttpError(
      "Could not fetch provider details, please try again.",
      500
    );

    return next(error);
  }
};

const getProviderOrders = async (req, res, next) => {
  let providerId = req.params.providerId;

  try {
    let result = await pool.query(
      `SELECT 
                                    Orders.id, Orders.order_date, Orders.order_status, 
                                    Service.service_type, Service.service_category,
                                    Users.username
                                    FROM Orders INNER JOIN Service ON Orders.bag_id = Service.service_id
                                    INNER JOIN Users ON Orders.user_id = Users.id
                                    WHERE Service.provider_id = $1
                                    `,
      [providerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Could not fetch provider details, please try again.",
      500
    );

    return next(error);
  }
};

const addNewSubscribtion = async (req, res, next) => {
  let providerId = req.params.providerId;

  try {
    let result = await pool.query(
      "UPDATE users SET subscribed = $1 WHERE id = $2",
      [true, providerId]
    );

    res.json({ providerSubscribed: true });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Could not add your subscription provider details, please try again.",
      500
    );

    return next(error);
  }
};

exports.addNewSurpriseBag = addNewSurpriseBag;
exports.updateProviderInfo = updateProviderInfo;
exports.getProviderServices = getProviderServices;
exports.getProviderDetails = getProviderDetails;
exports.getProviderOrders = getProviderOrders;
exports.addNewSubscribtion = addNewSubscribtion;
