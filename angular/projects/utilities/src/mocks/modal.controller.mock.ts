/// <reference types="jasmine" />
export class ModalControllerMock {

  public static instance(htmlIonModalElementMock: HTMLIonModalElement): jasmine.SpyObj<HTMLIonModalElement> {
    const modalControllerInstance: any = jasmine.createSpyObj('ModalController', ['create', 'dismiss', 'getTop']);
    modalControllerInstance.create.and.returnValue(Promise.resolve(htmlIonModalElementMock as HTMLIonModalElement));
    modalControllerInstance.dismiss.and.returnValue(Promise.resolve());
    modalControllerInstance.getTop.and.returnValue(Promise.resolve(htmlIonModalElementMock as HTMLIonModalElement));
    spyOn(htmlIonModalElementMock, 'present').and.callThrough();
    spyOn(htmlIonModalElementMock, 'dismiss').and.callThrough();
    return modalControllerInstance;
  }

  public static getOverlayEventDetail(value: any): Promise<{ data?: any; role?: string; }> {
    return Promise.resolve({data: value});
  }

}

export const HTML_ION_MODAL_ELEMENT_MOCK: Partial<HTMLIonModalElement> = {
  present: () => Promise.resolve(),
  dismiss: () => Promise.resolve(true),
  onDidDismiss: () => Promise.resolve({})
};
