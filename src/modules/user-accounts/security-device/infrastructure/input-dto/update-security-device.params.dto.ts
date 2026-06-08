export interface IUpdateSecurityDeviceParamsDto {
  userId: string;
  deviceId: string;
  iat: number;
  newIat: number;
  newExpirationAt: number;
}
