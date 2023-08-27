const fs = require("fs");
const path = require("path");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const HttpError = require("./models/http-error");
const userRoutes = require("./routes/user-routes");
const providerRoutes = require("./routes/provider-routes");
const adminRoutes = require("./routes/admin-routes");

app.use(cors());
// app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/api/users", userRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

// Start the server

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is listening on port ${process.env.PORT || 5000}`);
});
