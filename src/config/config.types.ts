import { ConfigService } from '@nestjs/config';
import { IEnvVariables } from './env.interface';

export type AppConfigService = ConfigService<IEnvVariables>;
