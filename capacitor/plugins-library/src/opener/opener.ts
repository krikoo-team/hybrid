import {Plugins, registerWebPlugin, WebPlugin} from '@capacitor/core';

import {OpenerPlugin} from '../definitions';

import {OpenOptions} from './models/OpenOptions';

export class OpenerWeb extends WebPlugin implements OpenerPlugin {
  constructor() {
    super({
      name: 'Opener',
      platforms: ['web']
    });
  }

  async open(options: OpenOptions): Promise<{ status: any }> {
    console.log('Open options', options);
    return {status: 'status here...'};
  }
}

class OpenerNative implements OpenerPlugin {
  public open(options: OpenOptions): Promise<{ status: any }> {
    return Plugins.Opener.open(options);
  }
}

const Opener = new OpenerNative();
export {Opener};
registerWebPlugin(new OpenerWeb());
