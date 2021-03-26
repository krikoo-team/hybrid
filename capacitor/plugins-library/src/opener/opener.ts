import {FileReadOptions, FileReadResult, Plugins, registerWebPlugin, WebPlugin} from '@capacitor/core';

import {OpenerPlugin} from '../definitions';

import {KrikooMimeType} from '../models/KrikooMimeType';
import {OpenOptions} from './models/OpenOptions';

export class OpenerWeb extends WebPlugin implements OpenerPlugin {

  private readonly OPENABLE_MIME_TYPES: Array<string> = [
    KrikooMimeType.BmpImage,
    KrikooMimeType.GifImage,
    KrikooMimeType.JpgImage,
    KrikooMimeType.JpegImage,
    KrikooMimeType.PngImage,
    KrikooMimeType.TifImage,
    KrikooMimeType.Pdf
  ];

  constructor() {
    super({
      name: 'Opener',
      platforms: ['web']
    });
  }

  async open(options: OpenOptions): Promise<{ status: any }> {
    const fileReadOptions: FileReadOptions = {directory: options.directory, path: options.path};
    const mimeType: KrikooMimeType = OpenerWeb.getFileMIMEType(options.path);
    try {
      const fileReadResult: FileReadResult = await Plugins.Filesystem.readFile(fileReadOptions);
      const url: string = `data:${mimeType};base64,${fileReadResult.data}`;
      if (this.OPENABLE_MIME_TYPES.includes(mimeType)) {
        const file: File = await OpenerWeb.convertToFile(url, options.displayableName, mimeType)
        window.open(URL.createObjectURL(file));
        return {status: {}};
      } else {
        const downloadAnchor: HTMLAnchorElement = document.createElement('a');
        downloadAnchor.download = `${options.displayableName}`;
        downloadAnchor.href = url;
        downloadAnchor.click();
      }
    } catch (error) {
      throw {message: error};
    }
  }

  private static convertToFile(url: string, filename: string, mimeType: KrikooMimeType): Promise<File> {
    return fetch(url)
      .then((response: Response) => response.arrayBuffer())
      .then((arrayBuffer: ArrayBuffer) => new File([arrayBuffer], filename, {type: mimeType}))
  }

  private static getFileMIMEType(path: string): KrikooMimeType {
    const getExtensionRegExp: RegExp = new RegExp(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi);
    const matches: Array<string> = (path || '').toLowerCase().match(getExtensionRegExp);
    const extension: string = !matches || !matches.length ? '' : matches[0].replace('.', '');
    switch (!extension ? '' : extension.toLowerCase()) {
      case 'bmp':
        return KrikooMimeType.BmpImage;
      case 'docx':
      case 'pages':
        return KrikooMimeType.Document;
      case 'gif':
        return KrikooMimeType.GifImage;
      case 'jpeg':
      case 'jpg':
        return KrikooMimeType.JpegImage;
      case 'doc':
      case 'dot':
      case 'rtf':
        return KrikooMimeType.MSDocument;
      case 'ppt':
      case 'pot':
      case 'pps':
      case 'ppa':
        return KrikooMimeType.MSPresentation;
      case 'xls':
      case 'xlt':
      case 'xla':
        return KrikooMimeType.MSSheet;
      case 'pdf':
        return KrikooMimeType.Pdf;
      case 'txt':
        return KrikooMimeType.PlainText;
      case 'png':
        return KrikooMimeType.PngImage;
      case 'pptx':
      case 'keynote':
        return KrikooMimeType.Presentation;
      case 'xlsx':
      case 'numbers':
        return KrikooMimeType.Sheet;
      case 'tif':
        return KrikooMimeType.TifImage;
      default :
        return KrikooMimeType.Pdf;
    }
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
