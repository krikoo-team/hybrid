import {NgModule} from '@angular/core';

import {FirestoreProvider} from './firestore.provider';

@NgModule({
  providers: [FirestoreProvider]
})
export class FirestoreModule {
}
