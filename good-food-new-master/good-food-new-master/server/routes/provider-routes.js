const express = require("express");
const providerControllers = require("../controllers/provider-controllers");

const router = express.Router();

router.get(
  "/provider-details/:providerId",
  providerControllers.getProviderDetails
);
router.get(
  "/get-services/:providerId",
  providerControllers.getProviderServices
);
router.get(
  "/get-provider-orders/:providerId",
  providerControllers.getProviderOrders
);
router.post("/add-new-service", providerControllers.addNewSurpriseBag);
router.patch(
  "/update-provider-info/:providerId",
  providerControllers.updateProviderInfo
);

router.patch(
  "/add-new-subscribtion/:providerId",
  providerControllers.addNewSubscribtion
);

module.exports = router;
