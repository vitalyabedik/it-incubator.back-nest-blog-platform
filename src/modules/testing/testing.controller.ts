import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { routersPaths } from '../../core/constants/paths';
import { EResultStatus } from '../../core/constants/resultCode';

@Controller(routersPaths.testing.root)
export class TestingController {
  constructor(
    @InjectConnection() private readonly databaseConnection: Connection,
  ) {}

  @Delete(routersPaths.testing.resetDb)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    const collections = await this.databaseConnection.listCollections();

    const promises = collections.map((collection) =>
      this.databaseConnection.collection(collection.name).deleteMany({}),
    );

    await Promise.all(promises);

    return {
      status: EResultStatus.Success,
    };
  }
}
