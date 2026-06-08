export interface ISecurityDeviceEntityDto {
  userId: string;
  deviceId: string;
  ip: string;
  deviceName: string;
  iat: number;
  expirationAt: number;
}
