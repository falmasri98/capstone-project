const express = require("express");
const userControllers = require("../controllers/user-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/get-user-details/:userId", userControllers.getUserDetails);
router.get("/get-services", userControllers.getAllServices);
router.get("/get-stores-list", userControllers.getStoresList);
router.get("/get-user-orders/:userId", userControllers.getUserOrders);
router.post(
  "/register",
  fileUpload.single("image"),
  userControllers.registerUser
);
router.post("/login", userControllers.userLogin);
router.post("/add-new-order", userControllers.addNewOrder);
router.post("/add-new-feedback", userControllers.addFeedback);
router.patch("/confirm-order/:orderId", userControllers.confirmOrder);
router.patch("/update-user-info/:userId", userControllers.updateUserInfo);
router.delete("/delete-order/:orderId", userControllers.deleteOrder);

module.exports = router;
