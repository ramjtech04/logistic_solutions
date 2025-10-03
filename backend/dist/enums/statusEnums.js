"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryStatus = exports.RequestStatus = void 0;
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["Pending"] = "Pending";
    RequestStatus["Accepted"] = "Accepted";
    RequestStatus["Approved"] = "Approved";
    RequestStatus["Cancelled"] = "Cancelled";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["NotStarted"] = "NotStarted";
    DeliveryStatus["InTransit"] = "InTransit";
    DeliveryStatus["Delivered"] = "Delivered";
    DeliveryStatus["Failed"] = "Failed";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
//# sourceMappingURL=statusEnums.js.map