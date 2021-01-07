import {
  AngularFirestoreCollection,
  AngularFirestoreCollectionGroup,
  DocumentData,
  DocumentReference,
  QueryGroupFn
} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

import {FirestoreProvider} from './firestore.provider';

export class FirestoreProviderMock {

  public static instance(): Partial<FirestoreProvider> {
    return {
      add(collection: AngularFirestoreCollection, document: DocumentData): Observable<DocumentReference> {
        return null as any;
      },
      collection(path: string): AngularFirestoreCollection<any> {
        return null as any;
      },
      collectionGroup(collectionId: string, queryGroupFn?: QueryGroupFn): AngularFirestoreCollectionGroup<any> {
        return null as any;
      },
      delete(collection: AngularFirestoreCollection, docId: string): Observable<null> {
        return null as any;
      },
      get(collection: AngularFirestoreCollection, docId: string): Observable<any> {
        return null as any;
      },
      getDoc(path: string, docId: string): Observable<any> {
        return null as any;
      },
      getFirst(collection: AngularFirestoreCollectionGroup, docId: string): Observable<any> {
        return null as any;
      },
      snapshotChanges(collection: AngularFirestoreCollection): Observable<Array<any>> {
        return null as any;
      },
      update(collection: AngularFirestoreCollection, docId: string, doc: any): Observable<{ id: string }> {
        return null as any;
      },
      valueChange(collection: AngularFirestoreCollection | AngularFirestoreCollectionGroup): Observable<Array<any>> {
        return null as any;
      }
    };
  }

}
