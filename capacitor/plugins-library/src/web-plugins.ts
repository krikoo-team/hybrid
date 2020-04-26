import {Plugins, mergeWebPlugins} from '@capacitor/core';

export * from './sharer/web';
export * from './data-storage/web';

mergeWebPlugins(Plugins);
