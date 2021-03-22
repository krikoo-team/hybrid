import {FileReadOptions, FileReadResult, Plugins, registerWebPlugin, WebPlugin} from '@capacitor/core';

import {SharerPlugin} from '../definitions';

import {KrikooMimeType} from '../opener/models/KrikooMimeType';
import {ShareError} from './models/ShareError.enum';
import {ShareableFile} from './models/ShareableFile';
import {ShareOptions} from './models/ShareOptions';
import {ShareOptionFile} from './models/ShareOptionFile';
import {ShareStatus} from './models/ShareStatus.enum';

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
        .then((fileReadResult: FileReadResult) => SharerWeb.convertToShareableFile(fileReadResult, shareOptionFile))
        .catch(() => null)
      readFilePromises.push(readFilePromise);
    });

    return Promise.all(readFilePromises)
      .then((shareableFiles: Array<ShareableFile>) =>
        new Promise((resolve, reject) => {
          SharerWeb.openFiles(shareableFiles);
          const hasError: boolean = shareableFiles.includes(null);
          hasError ? reject({message: ShareError.SomeFileDoesNotExist}) : resolve({status: ShareStatus.Shared});
        })
      );
  }

  private static convertToShareableFile(fileReadResult: FileReadResult, shareOptionFile: ShareOptionFile): ShareableFile {
    return {
      data: fileReadResult.data,
      displayableName: shareOptionFile.displayableName,
      path: shareOptionFile.path
    };
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

  private static openFiles(shareableFiles: Array<ShareableFile>): void {
    shareableFiles
      .filter((shareableFile: ShareableFile) => shareableFile)
      .forEach((shareableFile: ShareableFile) => {
        const mimeType: KrikooMimeType = SharerWeb.getFileMIMEType(shareableFile.path);
        const downloadAnchor: HTMLAnchorElement = document.createElement('a');
        downloadAnchor.download = `${shareableFile.displayableName}`;
        downloadAnchor.href = `data:${mimeType};base64,${shareableFile.data}`;
        downloadAnchor.click();
      });
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
