/// <reference types='jasmine' />
import {AlertButton, AlertOptions} from '@ionic/core';

export class AlertControllerMock {

  public static instance(htmlIonAlertElementMock: HTMLIonAlertElement): jasmine.SpyObj<HTMLIonAlertElement> {
    const alertControllerInstance: any = jasmine.createSpyObj('AlertController', ['create']);

    alertControllerInstance.create.and.callFake((alertOptions: AlertOptions) => {
      htmlIonAlertElementMock.buttons = alertOptions.buttons as any;
      htmlIonAlertElementMock.inputs = alertOptions.inputs as any;
      return Promise.resolve(htmlIonAlertElementMock as HTMLIonAlertElement);
    });

    spyOn(htmlIonAlertElementMock, 'present').and.callThrough();
    spyOn(htmlIonAlertElementMock, 'dismiss').and.callThrough();
    return alertControllerInstance;
  }

  public static clickAlertButton(buttonIndex: number, value: any, htmlIonAlertElementMock: HTMLIonAlertElement) {
    const alertButtons: Array<AlertButton> = (htmlIonAlertElementMock.buttons as Array<AlertButton>);
    alertButtons[buttonIndex].handler = alertButtons[buttonIndex].handler || (() => undefined);
    // @ts-ignore
    const handlerFunctionResult: boolean = alertButtons[buttonIndex].handler(value) as boolean;
    if (handlerFunctionResult || handlerFunctionResult === undefined) {
      htmlIonAlertElementMock.buttons = [{}] as Array<AlertButton>;
      htmlIonAlertElementMock.inputs = [{}];
      htmlIonAlertElementMock.dismiss();
    }
  }

}

export const HTML_ION_ALERT_ELEMENT_MOCK: Partial<HTMLIonAlertElement> = {
  present: () => Promise.resolve(),
  dismiss: () => Promise.resolve(true)
};

