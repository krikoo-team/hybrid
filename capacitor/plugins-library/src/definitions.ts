import {ShareOptions} from './ShareOptions';

declare module "@capacitor/core" {
    interface PluginRegistry {
        Sharer: SharerPlugin;
    }
}

export interface SharerPlugin {
    share(options: ShareOptions): Promise<{ value: string }>;
}
