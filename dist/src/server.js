"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupServer = void 0;
const core_1 = require("@overnightjs/core");
const body_parser_1 = __importDefault(require("body-parser"));
const forecast_1 = require("./controllers/forecast");
require("./util/module-alias");
class SetupServer extends core_1.Server {
    constructor(port = 3000) {
        super();
        this.port = port;
    }
    init() {
        this.setupExpress();
        this.setupControllers();
    }
    getApp() {
        return this.app;
    }
    setupExpress() {
        this.app.use(body_parser_1.default.json());
    }
    setupControllers() {
        const forecastController = new forecast_1.ForecastController();
        this.addControllers(forecastController);
    }
}
exports.SetupServer = SetupServer;
//# sourceMappingURL=server.js.map