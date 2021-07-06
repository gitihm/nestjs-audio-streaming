import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor';
import multerConfig from './multer/multer.config';
import * as fs from 'fs';
import * as multer from 'multer';

let uploader = (name: string) => {
  console.log('uploader ', name);

  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `${process.cwd()}/Data`);
      },
      filename: (req, file, cb) => {
        //   cb(null, file.originalname)
        console.log('name', name);

        cb(null, name);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
  }).single('file');
};

@Controller('audio')
export class UploadController {
  // @UseInterceptors(FilesInterceptor('file', 1, multerConfig))
  @Post('/:fileName/:id')
  async upload_image(
    @Req() req,
    // @UploadedFiles() file,
    @Param('fileName') fileName,
    @Param('id') id,
    @Res() res,
  ) {
    uploader(`${id}-${fileName}`)(req, res, async (err) => {
      try {
        if (err) {
          return res.status(HttpStatus.OK).json({ errorMessage: err });
        }
        return res.status(HttpStatus.OK).json({ isSuccess: true });
      } catch (error) {
        console.error(error);

        return res.status(HttpStatus.OK).json({ errorMessage: error });
      }
    });
  }

  @Post('merge')
  async merge(
    @Req() req,
    @Body('fileName') fileName,
    @Body('total') total,
    @Res() res,
  ) {
    try {
      for (let index = 1; index <= +total; index++) {
        const data = await fs.readFileSync(
          `${process.cwd()}/Data/${index}-${fileName}`,
        );
        // const data = await fs.readFileSync(
        //   `${process.cwd()}/Data/${index}.mp4`,
        // );
        console.log('DATA โวยยย', index, data);
        await fs.appendFile(
          `${process.cwd()}/Data/${fileName}`,
          data,
          (err) => {
            console.log(err);
          },
        );
        await fs.unlinkSync(`${process.cwd()}/Data/${index}-${fileName}`);
        // await fs.unlinkSync(`${process.cwd()}/Data/${index}.mp4`);
      }
      return res.status(HttpStatus.OK).json({ isSuccess: true });
    } catch (error) {
      console.error(error);

      return res.status(HttpStatus.OK).json({ errorMessage: error });
    }
  }

  @Get(':id')
  getHello(@Param('id') id, @Res() res): any {}
}
