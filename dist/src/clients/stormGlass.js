"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StormGlass = exports.StormGlassResponseError = exports.ClientRequestError = void 0;
const internal_error_1 = require("@src/util/errors/internal-error");
const config_1 = __importDefault(require("config"));
class ClientRequestError extends internal_error_1.InternalError {
    constructor(message) {
        const internalMessage = 'Unexpected error when trying to communicate to StormGlass';
        super(`${internalMessage}: ${message}`);
    }
}
exports.ClientRequestError = ClientRequestError;
class StormGlassResponseError extends internal_error_1.InternalError {
    constructor(message) {
        const internalMessage = 'Unexpected error returned by the StormGlass service';
        super(`${internalMessage}: ${message}`);
    }
}
exports.StormGlassResponseError = StormGlassResponseError;
const stormGlassResourceConfig = config_1.default.get('App.resources.StormGlass');
class StormGlass {
    constructor(request) {
        this.request = request;
        this.stormGlassAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
        this.stormGlassAPISource = 'noaa';
    }
    async fetchPoints(lat, lng) {
        try {
            const response = await this.request
                .get(`${stormGlassResourceConfig.get('apiUrl')}/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`, {
                headers: {
                    Authorization: stormGlassResourceConfig.get('apiToken'),
                },
            });
            return this.normalizeResponse(response.data);
        }
        catch (error) {
            if (error.response && error.response.status) {
                throw new StormGlassResponseError(`Error: ${JSON.stringify(error.response.data)} Code: ${error.response.status}`);
            }
            throw new ClientRequestError(error.message);
        }
    }
    normalizeResponse(points) {
        return points.hours
            .filter(this.isValidPoint.bind(this))
            .map((point) => ({
            swellDirection: point.swellDirection[this.stormGlassAPISource],
            swellHeight: point.swellHeight[this.stormGlassAPISource],
            swellPeriod: point.swellPeriod[this.stormGlassAPISource],
            time: point.time,
            waveDirection: point.waveDirection[this.stormGlassAPISource],
            waveHeight: point.waveHeight[this.stormGlassAPISource],
            windDirection: point.windDirection[this.stormGlassAPISource],
            windSpeed: point.windSpeed[this.stormGlassAPISource]
        }));
    }
    isValidPoint(point) {
        var _a, _b, _c, _d, _e, _f, _g;
        return !!(point.time && ((_a = point.swellDirection) === null || _a === void 0 ? void 0 : _a[this.stormGlassAPISource]) && ((_b = point.swellHeight) === null || _b === void 0 ? void 0 : _b[this.stormGlassAPISource]) && ((_c = point.swellPeriod) === null || _c === void 0 ? void 0 : _c[this.stormGlassAPISource]) && ((_d = point.waveDirection) === null || _d === void 0 ? void 0 : _d[this.stormGlassAPISource]) && ((_e = point.waveHeight) === null || _e === void 0 ? void 0 : _e[this.stormGlassAPISource]) && ((_f = point.windDirection) === null || _f === void 0 ? void 0 : _f[this.stormGlassAPISource]) && ((_g = point.windSpeed) === null || _g === void 0 ? void 0 : _g[this.stormGlassAPISource]));
    }
}
exports.StormGlass = StormGlass;
//# sourceMappingURL=stormGlass.js.map