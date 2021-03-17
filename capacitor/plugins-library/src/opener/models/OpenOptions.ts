import {FilesystemDirectory} from '@capacitor/core';

export interface OpenOptions {
  /**
   * Set a title for the share modal. Android only
   */
  dialogTitle?: string;
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
  /**
   * Set a URL to share
   */
  url?: string;
}
