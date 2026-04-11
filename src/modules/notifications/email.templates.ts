import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailTemplates {
  registrationEmail(code: string): string {
    return `<div>
                  <h1>Please confirm your email</h1>
                  <p>You should follow the link:   <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a></p>
            </div>`;
  }

  recoveryPassword(code: string): string {
    return `<div>
                  <h1>Password recovery</h1>
                  <p>You should follow the link:   <a href='https://somesite.com/recovery-password?code=${code}'>recovery password</a></p>
            </div>`;
  }
}
