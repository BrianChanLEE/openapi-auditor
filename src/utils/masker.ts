export class Masker {
    static mask(data: any): any {
        if (typeof data === 'string') {
            // Mask common auth headers/tokens in strings
            return data.replace(/(Authorization|Cookie|token|secret)([:= ])(\s*)([^\s,;&]+)/gi, '$1$2$3****');
        }
        if (typeof data === 'object' && data !== null) {
            const masked = { ...data };
            const sensitiveKeys = ['authorization', 'cookie', 'token', 'secret', 'password', 'x-auth-token'];
            for (const key of Object.keys(masked)) {
                if (sensitiveKeys.includes(key.toLowerCase())) {
                    masked[key] = '****';
                } else if (typeof masked[key] === 'object') {
                    masked[key] = this.mask(masked[key]);
                }
            }
            return masked;
        }
        return data;
    }
}
