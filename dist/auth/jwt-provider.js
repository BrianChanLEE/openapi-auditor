"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtProvider = exports.UserRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["OPERATOR"] = "OPERATOR";
    UserRole["READONLY"] = "READONLY";
})(UserRole || (exports.UserRole = UserRole = {}));
class JwtProvider {
    static generateToken(role, userId = 'test-user', expiresIn = '1h') {
        try {
            const payload = {
                userId,
                role,
            };
            const options = {
                issuer: this.ISSUER,
                expiresIn: expiresIn,
            };
            const token = jsonwebtoken_1.default.sign(payload, this.SECRET, options);
            logger_1.Logger.debug(`JWT 생성 완료: Role=${role}, UserId=${userId}`);
            return token;
        }
        catch (error) {
            logger_1.Logger.error(`JWT 생성 중 오류 발생 | Error: ${error.message}`);
            throw error;
        }
    }
    static verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.SECRET, {
                issuer: this.ISSUER,
            });
            return decoded;
        }
        catch (error) {
            logger_1.Logger.error(`JWT 검증 실패 | Error: ${error.message}`);
            throw error;
        }
    }
    static getAuthHeader(token) {
        return { Authorization: `Bearer ${token}` };
    }
}
exports.JwtProvider = JwtProvider;
JwtProvider.SECRET = 'test-secret-key';
JwtProvider.ISSUER = 'api-quality-platform';
//# sourceMappingURL=jwt-provider.js.map