import {ShareOptions} from './sharer/models/ShareOptions';

import {DataBaseOptions} from './data-storage/models/DataBaseOptions';
import {DeleteOptions} from './data-storage/models/DeleteOptions';
import {DropOptions} from './data-storage/models/DropOptions';
import {FilePickerResult} from './file-picker/models/FilePickerResult';
import {OpenOptions} from './opener/models/OpenOptions';
import {RetrieveAllOptions} from './data-storage/models/RetrieveAllOptions';
import {RetrieveOptions} from './data-storage/models/RetrieveOptions';
import {StoreOptions} from './data-storage/models/StoreOptions';

declare module "@capacitor/core" {
  interface PluginRegistry {
    DataStorage: DataStoragePlugin;
    FilePicker: FilePickerPlugin;
    Opener: OpenerPlugin;
    Sharer: SharerPlugin;
  }
}

export interface DataStoragePlugin {
  database(options: DataBaseOptions): Promise<{}>;

  delete(options: DeleteOptions): Promise<{}>;

  drop(options: DropOptions): Promise<{}>;

  remove(): Promise<{}>;

  retrieve(options: RetrieveOptions): Promise<{ value: any }>;

  retrieveAll(options: RetrieveAllOptions): Promise<{ [key: string]: any }>;

  store(options: StoreOptions): Promise<{}>;
}

export interface FilePickerPlugin {
  present(): Promise<FilePickerResult>;
}

export interface OpenerPlugin {
  open(options: OpenOptions): Promise<{ status: any }>;
}

export interface SharerPlugin {
  share(options: ShareOptions): Promise<{ status: any }>;
}
