import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreCollectionGroup,
  DocumentChangeAction,
  DocumentReference,
  QueryFn
} from '@angular/fire/firestore';
import {CollectionReference} from '@angular/fire/firestore/interfaces';
import {AngularFireModule} from '@angular/fire';
import {NextObserver, of} from 'rxjs';
import firebase from 'firebase';

import {ANGULAR_FIRESTORE_COLLECTION_MOCK} from './models/AngularFirestoreCollection.mock';
import {FirestoreProvider} from './firestore.provider';
import {ANGULAR_FIRESTORE_COLLECTION_GROUP_MOCK} from './models/AngularFirestoreCollectionGroup.mock';

class AngularFirestoreMock {
  public static instance(): Partial<AngularFirestore> {
    return {
      collection<T>(path: string | CollectionReference, queryFn?: QueryFn): AngularFirestoreCollection<T> {
        return null as any;
      }
    };
  }
}

describe('Firestore Provider', () => {

  const angularFirestoreCollection: AngularFirestoreCollection = ANGULAR_FIRESTORE_COLLECTION_MOCK;
  const angularFirestoreCollectionGroup: AngularFirestoreCollectionGroup = ANGULAR_FIRESTORE_COLLECTION_GROUP_MOCK;
  const firebaseConfig: { [key: string]: string } = {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: 'projectId',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  };

  let firestoreProvider: FirestoreProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(firebaseConfig)
      ],
      providers: [
        FirestoreProvider,
        {provide: AngularFirestore, userValue: AngularFirestoreMock.instance()}
      ]
    });
    firestoreProvider = TestBed.inject(FirestoreProvider);
  });

  describe('#add', () => {

    let addSpy: jasmine.Spy;

    beforeEach(() => {
      addSpy = spyOn(angularFirestoreCollection, 'add');
    });

    it('should add a document into a collection.', fakeAsync(() => {
      const documentReferenceMock: Partial<DocumentReference> = {
        get(): Promise<firebase.firestore.DocumentSnapshot<any>> {
          return Promise.resolve({
            data: () => {
              return {};
            },
            id: 'id',
          }) as Promise<any>;
        }
      };
      addSpy.and.returnValue(Promise.resolve(documentReferenceMock));
      const addNextObserver: NextObserver<DocumentReference> = {
        complete: () => {
          expect(addSpy).toHaveBeenCalledTimes(1);
          expect(addSpy).toHaveBeenCalledWith({attr: 'attr'});
        },
        error: () => fail(),
        next: (result: any) => expect(result).toEqual({id: 'id'})
      };
      firestoreProvider.add(angularFirestoreCollection, {attr: 'attr'}).subscribe(addNextObserver);
      tick();
    }));

    it('should return an error.', fakeAsync(() => {
      addSpy.and.returnValue(Promise.reject('error'));
      const addNextObserver: NextObserver<DocumentReference> = {
        complete: () => fail(),
        error: (error: string) => {
          expect(error).toEqual('error');
          expect(addSpy).toHaveBeenCalledTimes(1);
          expect(addSpy).toHaveBeenCalledWith({attr: 'attr'});
        },
        next: () => fail()
      };
      firestoreProvider.add(angularFirestoreCollection, {attr: 'attr'}).subscribe(addNextObserver);
      tick();
    }));

  });

  it('#collection should return a firestore documents collection.', () => {
    const angularFirestore: AngularFirestore = TestBed.inject(AngularFirestore);
    const collectionSpy: jasmine.Spy = spyOn(angularFirestore, 'collection').and.returnValue(angularFirestoreCollection);

    expect(firestoreProvider.collection('path')).toEqual(angularFirestoreCollection);
    expect(collectionSpy).toHaveBeenCalledTimes(1);
    expect(collectionSpy).toHaveBeenCalledWith('path', undefined);
  });

  it('#collectionGroup should return a firestore documents collection group.', () => {
    const angularFirestore: AngularFirestore = TestBed.inject(AngularFirestore);
    const collectionGroupSpy: jasmine.Spy = spyOn(angularFirestore, 'collectionGroup').and.returnValue(angularFirestoreCollectionGroup);

    expect(firestoreProvider.collectionGroup('path')).toEqual(angularFirestoreCollectionGroup);
    expect(collectionGroupSpy).toHaveBeenCalledTimes(1);
    expect(collectionGroupSpy).toHaveBeenCalledWith('path', undefined);
  });

  describe('#delete', () => {

    let deleteSpy: jasmine.Spy;
    let docSpy: jasmine.Spy;

    beforeEach(() => {
      const doc: any = {delete: null};
      docSpy = spyOn(angularFirestoreCollection, 'doc').and.returnValue(doc);
      deleteSpy = spyOn(doc, 'delete');
    });

    it('should delete a document.', fakeAsync(() => {
      deleteSpy.and.returnValue(Promise.resolve(null));
      const deleteNextObserver: NextObserver<null> = {
        complete: () => {
          expect(docSpy).toHaveBeenCalledTimes(1);
          expect(docSpy).toHaveBeenCalledWith('id');

          expect(deleteSpy).toHaveBeenCalledTimes(1);
          expect(deleteSpy).toHaveBeenCalledWith();
        },
        error: () => fail(),
        next: (result: null) => expect(result).toBeNull()
      };
      firestoreProvider.delete(angularFirestoreCollection, 'id').subscribe(deleteNextObserver);
      tick();
    }));

    it('should return an error.', fakeAsync(() => {
      deleteSpy.and.returnValue(Promise.reject('error'));
      const deleteNextObserver: NextObserver<null> = {
        complete: () => fail(),
        error: (error: string) => {
          expect(error).toEqual('error');

          expect(docSpy).toHaveBeenCalledTimes(1);
          expect(docSpy).toHaveBeenCalledWith('id');

          expect(deleteSpy).toHaveBeenCalledTimes(1);
          expect(deleteSpy).toHaveBeenCalledWith();
        },
        next: () => fail()
      };
      firestoreProvider.delete(angularFirestoreCollection, 'id').subscribe(deleteNextObserver);
      tick();
    }));

  });

  it('#get should return a document of a collection by id.', () => {
    const doc: any = {valueChanges: null};
    const docSpy: jasmine.Spy = spyOn(angularFirestoreCollection, 'doc').and.returnValue(doc);
    const valueChangesSpy: jasmine.Spy = spyOn(doc, 'valueChanges').and.returnValue(of({attr: 'attr'}));
    const getNextObserver: NextObserver<{ id: string, [key: string]: string }> = {
      complete: () => {
        expect(docSpy).toHaveBeenCalledTimes(1);
        expect(docSpy).toHaveBeenCalledWith('id');

        expect(valueChangesSpy).toHaveBeenCalledTimes(1);
        expect(valueChangesSpy).toHaveBeenCalledWith();
      },
      error: () => fail(),
      next: (result: { id: string, [key: string]: string }) => expect(result).toEqual({attr: 'attr', id: 'id'})
    };
    firestoreProvider.get(angularFirestoreCollection, 'id').subscribe(getNextObserver);
  });

  it('#getDoc should return a document by id.', () => {
    const angularFirestore: AngularFirestore = TestBed.inject(AngularFirestore);
    const doc: any = {valueChanges: null};
    const docSpy: jasmine.Spy = spyOn(angularFirestore, 'doc').and.returnValue(doc);
    const valueChangesSpy: jasmine.Spy = spyOn(doc, 'valueChanges').and.returnValue(of({attr: 'attr'}));
    const getDocNextObserver: NextObserver<{ id: string, [key: string]: string }> = {
      complete: () => {
        expect(docSpy).toHaveBeenCalledTimes(1);
        expect(docSpy).toHaveBeenCalledWith('path/id');

        expect(valueChangesSpy).toHaveBeenCalledTimes(1);
        expect(valueChangesSpy).toHaveBeenCalledWith();
      },
      error: () => fail(),
      next: (result: { id: string, [key: string]: string }) => expect(result).toEqual({attr: 'attr', id: 'id'})
    };
    firestoreProvider.getDoc('path', 'id').subscribe(getDocNextObserver);
  });

  describe('#getFirst', () => {

    it('#should return first element of a value change.', () => {
      const valueChangeSpy: jasmine.Spy = spyOn(angularFirestoreCollectionGroup, 'valueChanges').and.returnValue(of([{id: 'id1'}, {id: 'id2'}]));
      const valueChangeNextObserver: NextObserver<{ id: string }> = {
        complete: () => {
          expect(valueChangeSpy).toHaveBeenCalledTimes(1);
          expect(valueChangeSpy).toHaveBeenCalledWith();
        },
        error: () => fail(),
        next: (result: { id: string }) => expect(result).toEqual({id: 'id'})
      };
      firestoreProvider.getFirst(angularFirestoreCollectionGroup, 'id').subscribe(valueChangeNextObserver);
    });

    it('#should return a null result when an empty array is retrieved.', () => {
      const valueChangeSpy: jasmine.Spy = spyOn(angularFirestoreCollectionGroup, 'valueChanges').and.returnValue(of([]));
      const valueChangeNextObserver: NextObserver<{ id: string }> = {
        complete: () => {
          expect(valueChangeSpy).toHaveBeenCalledTimes(1);
          expect(valueChangeSpy).toHaveBeenCalledWith();
        },
        error: () => fail(),
        next: (result: { id: string }) => expect(result).toBeNull()
      };
      firestoreProvider.getFirst(angularFirestoreCollectionGroup, 'id').subscribe(valueChangeNextObserver);
    });

  });

  it('#snapshotChanges should an snapshot of a collection.', () => {
    const actions: Array<DocumentChangeAction<any>> = [{
      payload: {
        doc: {
          data: () => {
            return {attr: 'attr'};
          },
          id: 'id'
        } as any
      } as any,
      type: null as any
    }];
    const auditTrailSpy: jasmine.Spy = spyOn(angularFirestoreCollection, 'auditTrail')
      .and.returnValue(of(actions));
    const snapshotChangesNextObserver: NextObserver<Array<any>> = {
      complete: () => {
        expect(auditTrailSpy).toHaveBeenCalledTimes(1);
        expect(auditTrailSpy).toHaveBeenCalledWith();
      },
      error: () => fail(),
      next: (results: Array<any>) => expect(results).toEqual([{attr: 'attr', id: 'id'}])
    };
    firestoreProvider.snapshotChanges(angularFirestoreCollection).subscribe(snapshotChangesNextObserver);
  });

  describe('#update', () => {

    let updateSpy: jasmine.Spy;
    let docSpy: jasmine.Spy;

    beforeEach(() => {
      const doc: any = {update: null};
      docSpy = spyOn(angularFirestoreCollection, 'doc').and.returnValue(doc);
      updateSpy = spyOn(doc, 'update');
    });

    it('should update a document.', fakeAsync(() => {
      updateSpy.and.returnValue(Promise.resolve(null));
      const updateNextObserver: NextObserver<{ id: string }> = {
        complete: () => {
          expect(docSpy).toHaveBeenCalledTimes(1);
          expect(docSpy).toHaveBeenCalledWith('id');

          expect(updateSpy).toHaveBeenCalledTimes(1);
          expect(updateSpy).toHaveBeenCalledWith({attr: 'attr'});
        },
        error: () => fail(),
        next: (result: { id: string }) => expect(result).toEqual({id: 'id'})
      };
      firestoreProvider.update(angularFirestoreCollection, 'id', {attr: 'attr'}).subscribe(updateNextObserver)
      tick();
    }));

    it('should return an error.', fakeAsync(() => {
      updateSpy.and.returnValue(Promise.reject('error'));
      const updateNextObserver: NextObserver<{ id: string }> = {
        complete: () => fail(),
        error: (error: string) => {
          expect(error).toEqual('error');

          expect(docSpy).toHaveBeenCalledTimes(1);
          expect(docSpy).toHaveBeenCalledWith('id');

          expect(updateSpy).toHaveBeenCalledTimes(1);
          expect(updateSpy).toHaveBeenCalledWith({attr: 'attr'});
        },
        next: () => fail()
      };
      firestoreProvider.update(angularFirestoreCollection, 'id', {attr: 'attr'}).subscribe(updateNextObserver);
      tick();
    }));

  });

  it('#valueChange should get a value changed.', () => {
    const valueChangeSpy: jasmine.Spy = spyOn(angularFirestoreCollection, 'valueChanges').and.returnValue(of([{id: 'id'}]));
    const valueChangeNextObserver: NextObserver<Array<{ id: string }>> = {
      complete: () => {
        expect(valueChangeSpy).toHaveBeenCalledTimes(1);
        expect(valueChangeSpy).toHaveBeenCalledWith({idField: 'id'});
      },
      error: () => fail(),
      next: (result: Array<{ id: string }>) => expect(result).toEqual([{id: 'id'}])
    };
    firestoreProvider.valueChange(angularFirestoreCollection).subscribe(valueChangeNextObserver);
  });

});
