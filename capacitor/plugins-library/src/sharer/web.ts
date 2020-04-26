import {WebPlugin} from '@capacitor/core';
import {registerWebPlugin} from '@capacitor/core';

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

    async share(options: ShareOptions): Promise<{ value: string }> {
        options.files.forEach((shareOptionFile: ShareOptionFile) => {
            console.log('SHARE', shareOptionFile.directory, shareOptionFile.displayableName, shareOptionFile.path);
        });
        return {value: 'result here...'};
    }
}

const Sharer = new SharerWeb();
export {Sharer};
registerWebPlugin(Sharer);
