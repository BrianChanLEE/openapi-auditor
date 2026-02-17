import jwt, { SignOptions } from 'jsonwebtoken';
import { Logger } from '../utils/logger';

export enum UserRole {
    ADMIN = 'ADMIN',
    OPERATOR = 'OPERATOR',
    READONLY = 'READONLY',
}

export interface JwtPayload {
    userId: string;
    role: UserRole;
    iat: number;
    exp: number;
}

export class JwtProvider {
    private static readonly SECRET = 'test-secret-key';
    private static readonly ISSUER = 'api-quality-platform';

    static generateToken(role: UserRole, userId: string = 'test-user', expiresIn: string = '1h'): string {
        try {
            const payload = {
                userId,
                role,
            };

            const options: SignOptions = {
                issuer: this.ISSUER,
                expiresIn: expiresIn as any,
            };

            const token = jwt.sign(payload, this.SECRET, options);

            Logger.debug(`JWT 생성 완료: Role=${role}, UserId=${userId}`);
            return token;
        } catch (error: any) {
            Logger.error(`JWT 생성 중 오류 발생 | Error: ${error.message}`);
            throw error;
        }
    }

    static verifyToken(token: string): JwtPayload {
        try {
            const decoded = jwt.verify(token, this.SECRET, {
                issuer: this.ISSUER,
            }) as JwtPayload;
            return decoded;
        } catch (error: any) {
            Logger.error(`JWT 검증 실패 | Error: ${error.message}`);
            throw error;
        }
    }

    static getAuthHeader(token: string): { Authorization: string } {
        return { Authorization: `Bearer ${token}` };
    }
}
