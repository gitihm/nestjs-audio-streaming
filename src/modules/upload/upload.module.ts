import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: `../../Data`,
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [],
})
export class UploadModule { }
