import {Plugins, registerWebPlugin, WebPlugin} from '@capacitor/core';

import {DataStoragePlugin} from '../definitions';

import {DataBaseOptions} from './models/DataBaseOptions';
import {DeleteOptions} from './models/DeleteOptions';
import {DropOptions} from './models/DropOptions';
import {RetrieveOptions} from './models/RetrieveOptions';
import {StoreOptions} from './models/StoreOptions';

export class DataStorageWeb extends WebPlugin implements DataStoragePlugin {
    constructor() {
        super({
            name: 'DataStorage',
            platforms: ['web']
        });
    }

    async database(options: DataBaseOptions): Promise<{}> {
        console.log('DataStorageWeb -> config:', options);
        return {};
    }

    async delete(options: DeleteOptions): Promise<{}> {
        console.log('DataStorageWeb -> delete:', options);
        return {};
    }

    async drop(options: DropOptions): Promise<{}> {
        console.log('DataStorageWeb -> drop:', options);
        return {};
    }

    async remove(): Promise<{}> {
        console.log('DataStorageWeb -> remove:');
        return {};
    }

    async retrieve(options: RetrieveOptions): Promise<{ value: any }> {
        console.log('DataStorageWeb -> retrieve:', options);
        return {value: 'result here...'};
    }

    async store(options: StoreOptions): Promise<{}> {
        console.log('DataStorageWeb -> store:', options);
        return {};
    }
}

class DataStorageNative implements DataStoragePlugin {
    database(options: DataBaseOptions): Promise<{}> {
        return Plugins.DataStorage.database(options);
    }

    delete(options: DeleteOptions): Promise<{}> {
        return Plugins.DataStorage.delete(options);
    }

    drop(options: DropOptions): Promise<{}> {
        return Plugins.DataStorage.drop(options);
    }

    remove(): Promise<{}> {
        return Plugins.DataStorage.remove();
    }

    retrieve(options: RetrieveOptions): Promise<{ value: any }> {
        return Plugins.DataStorage.retrieve(options);
    }

    store(options: StoreOptions): Promise<{}> {
        return Plugins.DataStorage.store(options);
    }
}

const DataStorage = new DataStorageNative();
export {DataStorage};
registerWebPlugin(new DataStorageWeb());
