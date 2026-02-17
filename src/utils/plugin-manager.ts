import { Logger } from './logger';

export interface AuditorPlugin {
    name: string;
    version: string;
    description?: string;
    onInitialize?: (config: any) => void | Promise<void>;
    beforeRun?: (endpoints: any[]) => void | Promise<void>;
    afterRun?: (results: any[]) => void | Promise<void>;
    onReport?: (reportPath: string) => void | Promise<void>;
}

export class PluginManager {
    private plugins: AuditorPlugin[] = [];

    async load(pluginPaths: string[], config: any = {}) {
        for (const path of pluginPaths) {
            try {
                // 동적 import (Isolation을 위해 고려됨)
                const pluginModule = await import(path);
                const plugin: AuditorPlugin = pluginModule.default || pluginModule;

                Logger.info(`플러그인 로드 중: ${plugin.name} (v${plugin.version})`);

                if (plugin.onInitialize) {
                    await plugin.onInitialize(config);
                }

                this.plugins.push(plugin);
            } catch (error: any) {
                Logger.error(`플러그인 로드 실패 [${path}]: ${error.message}`);
            }
        }
    }

    async emitBeforeRun(endpoints: any[]) {
        for (const plugin of this.plugins) {
            if (plugin.beforeRun) await plugin.beforeRun(endpoints);
        }
    }

    async emitAfterRun(results: any[]) {
        for (const plugin of this.plugins) {
            if (plugin.afterRun) await plugin.afterRun(results);
        }
    }

    async emitOnReport(reportPath: string) {
        for (const plugin of this.plugins) {
            if (plugin.onReport) await plugin.onReport(reportPath);
        }
    }
}
