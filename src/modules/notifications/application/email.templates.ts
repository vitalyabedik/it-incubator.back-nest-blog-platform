import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailTemplates {
  registrationConfirmation(confirmationCode: string): string {
    return `<div>
                  <h1>Please confirm your email</h1>
                  <p>You should follow the link:   <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a></p>
            </div>`;
  }

  recoveryPassword(recoveryCode: string): string {
    return `<div>
                  <h1>Password recovery</h1>
                  <p>You should follow the link:   <a href='https://somesite.com/recovery-password?code=${recoveryCode}'>recovery password</a></p>
            </div>`;
  }
}
