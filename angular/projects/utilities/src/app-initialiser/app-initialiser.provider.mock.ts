import {AppInitialiserProvider} from './app-initialiser.provider';

export class AppInitialiserProviderMock {

  public static instance(): Partial<AppInitialiserProvider> {
    return {
      initialiseApp() {
      }
    };
  }

}
