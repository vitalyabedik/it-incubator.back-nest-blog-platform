export class UserRegisteredEmailResendingEvent {
  constructor(
    public readonly email: string,
    public confirmationCode: string,
  ) {}
}
