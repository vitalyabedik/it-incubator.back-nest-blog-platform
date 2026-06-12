import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { routersPaths } from '../../core/constants/paths';
import { EResultStatus } from '../../core/constants/resultCode';

@Controller(routersPaths.testing.root)
export class TestingController {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  @Delete(routersPaths.testing.resetDb)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    await this.dataSource.query(
      `
       TRUNCATE TABLE 
       "users", 
       "user_device_sessions", 
       "user_confirmations", 
       "user_recovery_codes",
       "blogs", 
       "posts",
       "comments",
       "post_likes",
       "comment_likes"
      `,
    );

    return {
      status: EResultStatus.Success,
    };
  }
}
