import {FileReadResult} from '@capacitor/core';

import {KrikooMimeType} from '../models/KrikooMimeType';
import {ShareOptionFile} from './models/ShareOptionFile';
import {ShareableFile} from './models/ShareableFile';

export class SharerUtils {

  public static convertToShareableFile(fileReadResult: FileReadResult, shareOptionFile: ShareOptionFile): ShareableFile {
    return {
      data: fileReadResult.data,
      displayableName: shareOptionFile.displayableName,
      path: shareOptionFile.path
    };
  }

  public static openFiles(shareableFiles: Array<ShareableFile>): void {
    shareableFiles
      .filter((shareableFile: ShareableFile) => shareableFile)
      .forEach((shareableFile: ShareableFile) => {
        const mimeType: KrikooMimeType = SharerUtils.getFileMIMEType(shareableFile.path);
        const downloadAnchor: HTMLAnchorElement = document.createElement('a');
        downloadAnchor.download = `${shareableFile.displayableName}`;
        downloadAnchor.href = `data:${mimeType};base64,${shareableFile.data}`;
        downloadAnchor.click();
      });
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
