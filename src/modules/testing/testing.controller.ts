import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectConnection } from '@nestjs/mongoose';
import { DataSource } from 'typeorm';
import { Connection } from 'mongoose';
import { routersPaths } from '../../core/constants/paths';
import { EResultStatus } from '../../core/constants/resultCode';

@Controller(routersPaths.testing.root)
export class TestingController {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectConnection() private readonly databaseConnection: Connection,
  ) {}

  @Delete(routersPaths.testing.resetDb)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    await this.dataSource.query(
      `
       TRUNCATE TABLE 
       "user_device_sessions", 
       "user_confirmations", 
       "user_recovery_codes",
       "users",
       "blogs",
       "posts"
        RESTART IDENTITY CASCADE;
      `,
    );

    const collections = await this.databaseConnection.listCollections();

    const mongoosePromises = collections.map((collection) =>
      this.databaseConnection.collection(collection.name).deleteMany({}),
    );

    await Promise.all(mongoosePromises);

    return {
      status: EResultStatus.Success,
    };
  }
}
