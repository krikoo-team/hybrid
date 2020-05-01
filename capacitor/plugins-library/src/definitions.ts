import {ShareOptions} from './sharer/models/ShareOptions';

import {DropOptions} from './data-storage/models/DropOptions';
import {RetrieveOptions} from './data-storage/models/RetrieveOptions';
import {StoreOptions} from './data-storage/models/StoreOptions';
import {DeleteOptions} from './data-storage/models/DeleteOptions';
import {DataBaseOptions} from './data-storage/models/DataBaseOptions';

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

    store(options: StoreOptions): Promise<{}>;
}
