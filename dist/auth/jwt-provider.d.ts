export declare enum UserRole {
    ADMIN = "ADMIN",
    OPERATOR = "OPERATOR",
    READONLY = "READONLY"
}
export interface JwtPayload {
    userId: string;
    role: UserRole;
    iat: number;
    exp: number;
}
export declare class JwtProvider {
    private static readonly SECRET;
    private static readonly ISSUER;
    static generateToken(role: UserRole, userId?: string, expiresIn?: string): string;
    static verifyToken(token: string): JwtPayload;
    static getAuthHeader(token: string): {
        Authorization: string;
    };
}
