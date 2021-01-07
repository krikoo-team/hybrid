import {NgModule} from '@angular/core';

import {AuthorisedGuard} from './authorised.guard';
import {FireAuthModule} from '../fire-auth/fire-auth.module';
import {NotAuthorisedGuard} from './not-authorised.guard';

@NgModule({
  exports: [FireAuthModule],
  imports: [FireAuthModule],
  providers: [AuthorisedGuard, NotAuthorisedGuard]
})
export class AuthorisationModule {
}
