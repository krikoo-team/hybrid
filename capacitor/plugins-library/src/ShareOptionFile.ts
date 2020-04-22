import {FilesystemDirectory} from '@capacitor/core';

export interface ShareOptionFile {
  /**
   * The FilesystemDirectory to store the file in. Default DATA.
   */
  directory?: FilesystemDirectory;
  /**
   * The file name with its extension to share. Default its origin name.
   */
  displayableName?: string;
  /**
   * The path to the file with its name and extension included: path/to/file.ext
   */
  path: string;
}
