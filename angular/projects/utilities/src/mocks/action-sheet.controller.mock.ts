/// <reference types="jasmine" />
import {ActionSheetButton, ActionSheetOptions} from '@ionic/core';

export class ActionSheetControllerMock {

  public static instance(htmlIonActionSheetElementMock: HTMLIonActionSheetElement): jasmine.SpyObj<HTMLIonActionSheetElement> {
    const actionSheetControllerInstance: any = jasmine.createSpyObj('ActionSheetController', ['create']);

    actionSheetControllerInstance.create.and.callFake((actionSheetOptions: ActionSheetOptions) => {
      htmlIonActionSheetElementMock.buttons = actionSheetOptions.buttons;
      return Promise.resolve(htmlIonActionSheetElementMock as HTMLIonActionSheetElement);
    });

    spyOn(htmlIonActionSheetElementMock, 'present').and.callThrough();
    spyOn(htmlIonActionSheetElementMock, 'dismiss').and.callThrough();
    return actionSheetControllerInstance;
  }

  public static clickActionSheetButton(buttonIndex: number, htmlIonActionSheetElementMock: HTMLIonActionSheetElement) {
    const handlerFunction: any = (htmlIonActionSheetElementMock.buttons as Array<ActionSheetButton>)[buttonIndex].handler;
    const handlerFunctionResult: boolean = !handlerFunction ? true : handlerFunction();
    if (handlerFunctionResult || handlerFunctionResult === undefined) {
      htmlIonActionSheetElementMock.buttons = [{}] as Array<ActionSheetButton>;
      !htmlIonActionSheetElementMock.dismiss();
    }
  }

}

export const HTML_ION_ACTION_SHEET_ELEMENT_MOCK: Partial<HTMLIonActionSheetElement> = {
  present: () => Promise.resolve(),
  dismiss: () => Promise.resolve(true)
};
