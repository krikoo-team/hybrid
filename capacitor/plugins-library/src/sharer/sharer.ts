import {Plugins, registerWebPlugin, WebPlugin} from '@capacitor/core';

import {SharerPlugin} from '../definitions';

import {ShareOptions} from './models/ShareOptions';
import {ShareOptionFile} from './models/ShareOptionFile';

export class SharerWeb extends WebPlugin implements SharerPlugin {
    constructor() {
        super({
            name: 'Sharer',
            platforms: ['web']
        });
    }

    async share(options: ShareOptions): Promise<{ status: any }> {
        options.files.forEach((shareOptionFile: ShareOptionFile) => {
            console.log('SHARE', shareOptionFile.directory, shareOptionFile.displayableName, shareOptionFile.path);
        });
        return {status: 'status here...'};
    }
}

class SharerNative implements SharerPlugin {
    public share(options: ShareOptions): Promise<{ status: any }> {
        return Plugins.Sharer.share(options);
    }
}

const Sharer = new SharerNative();
export {Sharer};
registerWebPlugin(new SharerWeb());
