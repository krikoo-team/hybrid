import {FileReadOptions, FileReadResult, Plugins, registerWebPlugin, WebPlugin} from '@capacitor/core';

import {SharerPlugin} from '../definitions';

import {ShareableFile} from './models/ShareableFile';
import {ShareError} from './models/ShareError.enum';
import {ShareOptions} from './models/ShareOptions';
import {ShareOptionFile} from './models/ShareOptionFile';
import {ShareStatus} from './models/ShareStatus.enum';

import {SharerUtils} from './sharer.utils';

export class SharerWeb extends WebPlugin implements SharerPlugin {
  constructor() {
    super({
      name: 'Sharer',
      platforms: ['web']
    });
  }

  public share(options: ShareOptions): Promise<{ status: any }> {
    let readFilePromises: Array<Promise<FileReadResult>> = [];

    options.files.forEach((shareOptionFile: ShareOptionFile) => {
      const fileReadOptions: FileReadOptions = {directory: shareOptionFile.directory, path: shareOptionFile.path};
      const readFilePromise: Promise<FileReadResult> = Plugins.Filesystem.readFile(fileReadOptions)
        .then((fileReadResult: FileReadResult) => SharerUtils.convertToShareableFile(fileReadResult, shareOptionFile))
        .catch(() => null)
      readFilePromises.push(readFilePromise);
    });

    return Promise.all(readFilePromises)
      .then((shareableFiles: Array<ShareableFile>) =>
        new Promise((resolve, reject) => {
          SharerUtils.openFiles(shareableFiles);
          const hasError: boolean = shareableFiles.includes(null);
          hasError ? reject({message: ShareError.SomeFileDoesNotExist}) : resolve({status: ShareStatus.Shared});
        })
      );
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
