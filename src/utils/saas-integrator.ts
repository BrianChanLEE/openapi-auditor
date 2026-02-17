import axios from 'axios';
import crypto from 'crypto';
import { Logger } from './logger';

export interface SaaSConfig {
    endpoint: string;
    apiKey: string;
    apiSecret: string;
}

export class SaaSIntegrator {
    /**
     * SaaS 엔드포인트로 진단 데이터를 전송합니다.
     * HMAC-SHA256 서명을 이용하여 보안 인증을 수행합니다.
     */
    static async sendReport(reportData: any, config: SaaSConfig) {
        if (!config.endpoint || !config.apiKey || !config.apiSecret) {
            Logger.warn('SaaS 연동을 위한 구성 정보가 부족합니다. 전송을 스킵합니다.');
            return;
        }

        try {
            const timestamp = Date.now().toString();
            const body = JSON.stringify(reportData);

            // HMAC 서명 생성: timestamp + body
            const signature = crypto
                .createHmac('sha256', config.apiSecret)
                .update(timestamp + body)
                .digest('hex');

            Logger.info(`SaaS 서버로 데이터 전송 중: ${config.endpoint}`);

            await axios.post(config.endpoint, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auditor-API-Key': config.apiKey,
                    'X-Auditor-Signature': signature,
                    'X-Auditor-Timestamp': timestamp,
                    'User-Agent': 'openapi-auditor-agent'
                }
            });

            Logger.info('SaaS 서버로 진단 리포트 전송이 완료되었습니다.');
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message;
            Logger.error(`SaaS 전송 실패: ${errorMsg}`);
        }
    }
}
