"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestTransitions = void 0;
const statusEnums_1 = require("../enums/statusEnums");
exports.requestTransitions = {
    [statusEnums_1.RequestStatus.Pending]: [statusEnums_1.RequestStatus.Accepted, statusEnums_1.RequestStatus.Cancelled],
    [statusEnums_1.RequestStatus.Accepted]: [statusEnums_1.RequestStatus.Approved, statusEnums_1.RequestStatus.Cancelled],
    [statusEnums_1.RequestStatus.Approved]: [],
    [statusEnums_1.RequestStatus.Cancelled]: [],
};
//# sourceMappingURL=statusRules.js.map