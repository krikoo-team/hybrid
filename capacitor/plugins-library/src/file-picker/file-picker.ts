import {Plugins, registerWebPlugin, WebPlugin} from '@capacitor/core';

import {FilePickerPlugin} from '../definitions';

import {FilePickerResult} from './models/FilePickerResult';

export class FilePickerWeb extends WebPlugin implements FilePickerPlugin {

  constructor() {
    super({
      name: 'FilePicker',
      platforms: ['web']
    });
  }

  async present(): Promise<FilePickerResult> {
    console.log('FILE_PICKER', 'Empty mock present.');
    return {data: '', extension: '', mimeType: '', name: '', uri: ''};
  }

}

class FilePickerNative implements FilePickerPlugin {
  public present(): Promise<FilePickerResult> {
    return Plugins.FilePicker.present();
  }
}

const FilePicker: FilePickerNative = new FilePickerNative();
export {FilePicker};
registerWebPlugin(new FilePickerWeb());
