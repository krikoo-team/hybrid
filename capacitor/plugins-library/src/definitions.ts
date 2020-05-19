import {ShareOptions} from './sharer/models/ShareOptions';

import {DataBaseOptions} from './data-storage/models/DataBaseOptions';
import {DeleteOptions} from './data-storage/models/DeleteOptions';
import {DropOptions} from './data-storage/models/DropOptions';
import {RetrieveAllOptions} from './data-storage/models/RetrieveAllOptions';
import {RetrieveOptions} from './data-storage/models/RetrieveOptions';
import {StoreOptions} from './data-storage/models/StoreOptions';

declare module "@capacitor/core" {
    interface PluginRegistry {
        Sharer: SharerPlugin;
        DataStorage: DataStoragePlugin;
    }
}

export interface SharerPlugin {
    share(options: ShareOptions): Promise<{ status: any }>;
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
