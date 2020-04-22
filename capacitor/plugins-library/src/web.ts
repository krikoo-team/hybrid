import {WebPlugin} from '@capacitor/core';
import {SharerPlugin} from './definitions';

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

import {registerWebPlugin} from '@capacitor/core';
import {ShareOptions} from './ShareOptions';
import {ShareOptionFile} from './ShareOptionFile';

registerWebPlugin(Sharer);
