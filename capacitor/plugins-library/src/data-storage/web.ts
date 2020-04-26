import {registerWebPlugin, WebPlugin} from '@capacitor/core';

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

const DataStorage = new DataStorageWeb();
export {DataStorage};
registerWebPlugin(DataStorage);
