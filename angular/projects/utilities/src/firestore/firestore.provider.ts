import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreCollectionGroup,
  DocumentChangeAction,
  DocumentData,
  DocumentReference, DocumentSnapshot,
  QueryFn, QueryGroupFn
} from '@angular/fire/firestore';
import {Observable, Subscriber} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class FirestoreProvider {

  constructor(private angularFirestore: AngularFirestore) {
  }

  public add(collection: AngularFirestoreCollection, document: DocumentData): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      collection.add(document)
        .then((documentReference: DocumentReference): Promise<any> => documentReference.get())
        .then((documentSnapshot: DocumentSnapshot<DocumentData>) => {
          const data: any = documentSnapshot.data();
          data.id = documentSnapshot.id;
          subscriber.next(data);
          subscriber.complete();
        })
        .catch((error: any) => subscriber.error(error));
    });
  }

  public collection(path: string, queryFn?: QueryFn): AngularFirestoreCollection<any> {
    return this.angularFirestore.collection(path, queryFn);
  }

  public collectionGroup(collectionId: string, queryGroupFn?: QueryGroupFn): AngularFirestoreCollectionGroup<any> {
    return this.angularFirestore.collectionGroup(collectionId, queryGroupFn);
  }

  public delete(collection: AngularFirestoreCollection, docId: string): Observable<null> {
    return new Observable((subscriber: Subscriber<null>) => {
      collection.doc(docId).delete()
        .then(() => {
          subscriber.next(null);
          subscriber.complete();
        })
        .catch((error: any) => subscriber.error(error));
    });
  }

  public get(collection: AngularFirestoreCollection, docId: string): Observable<any> {
    return collection.doc(docId).valueChanges().pipe(
      map((doc: { [key: string]: string, id: string } | any) => {
        doc.id = docId;
        return doc;
      })
    );
  }

  public getDoc(path: string, docId: string): Observable<any> {
    return this.angularFirestore.doc(`${path}/${docId}`).valueChanges().pipe(
      map((doc: { [key: string]: string, id: string } | any) => {
        doc.id = docId;
        return doc;
      })
    );
  }

  public getFirst(collection: AngularFirestoreCollectionGroup, docId: string): Observable<any> {
    return collection.valueChanges().pipe(
      map((docs: Array<{ [key: string]: string | undefined, id?: string }>) => {
        if (!docs.length) {
          return null;
        } else {
          const doc: { [key: string]: string | undefined, id?: string } = docs[0];
          doc.id = docId;
          return doc;
        }
      })
    );
  }

  public snapshotChanges(collection: AngularFirestoreCollection | AngularFirestoreCollectionGroup): Observable<Array<any>> {
    return collection.auditTrail()
      .pipe(map((actions: Array<DocumentChangeAction<any>>) => {
        return actions.map((action: DocumentChangeAction<any>) => {
          const data: any = action.payload.doc.data();
          data.id = (action.payload.doc as any).id;
          return data;
        });
      }));
  }

  public update(collection: AngularFirestoreCollection, docId: string, doc: any): Observable<{ id: string }> {
    return new Observable((subscriber: Subscriber<any>) => {
      collection.doc(docId).update(doc)
        .then(() => {
          subscriber.next({id: docId});
          subscriber.complete();
        })
        .catch((error: any) => subscriber.error(error));
    });
  }

  public valueChange(collection: AngularFirestoreCollection | AngularFirestoreCollectionGroup): Observable<Array<any>> {
    return collection.valueChanges({idField: 'id'});
  }

}
