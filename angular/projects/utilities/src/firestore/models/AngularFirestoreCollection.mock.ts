import {AngularFirestoreCollection} from '@angular/fire/firestore';

export const ANGULAR_FIRESTORE_COLLECTION_MOCK: AngularFirestoreCollection = {
  ref: null,
  query: null,
  afs: null,
  stateChanges: null,
  auditTrail: null,
  snapshotChanges: null,
  valueChanges: null,
  get: null,
  add: null,
  doc: () => {
    return {
      delete: null,
      valueChanges: null
    };
  }
} as any;
