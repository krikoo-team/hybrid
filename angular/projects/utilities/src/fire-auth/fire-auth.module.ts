import {NgModule} from '@angular/core';
import {AngularFireAuthModule} from '@angular/fire/auth';

import {FireAuthProvider} from './fire-auth.provider';

@NgModule({
  exports: [AngularFireAuthModule],
  imports: [AngularFireAuthModule],
  providers: [FireAuthProvider]
})
export class FireAuthModule {
}
