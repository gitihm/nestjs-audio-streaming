import {
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
import { Readable } from 'stream'

import * as mongoose from 'mongoose'
const ObjectID = require('mongodb').ObjectID;

mongoose.connect(
  `mongodb://myuser:secret@localhost:27017/mydatabase`,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  },
)


@Controller('audio')
export class UploadController {
  @Post()
  @UseInterceptors(FilesInterceptor('file', 1, multerConfig))
  async upload_image(@Req() req, @UploadedFiles() file, @Res() res) {
    let status = HttpStatus.OK;
    if (file) {
      let trackName = file[0].originalname;

      const readableTrackStream = new Readable();
      
      readableTrackStream.push(file[0].buffer);
      readableTrackStream.push(null);

      const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'audio'
      });

      let uploadStream = gridFSBucket.openUploadStream(trackName);
      let id = uploadStream.id;

      readableTrackStream.pipe(uploadStream);

      uploadStream.on('error', () => {
        return res.status(500).json({ message: "Error uploading file" });
      });

      uploadStream.on('finish', () => {
        return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id });
      });

    } else {
      return res.status(status).json({ message: 'select file first' });
    }
  }

  @Get(':id')
  getHello(@Param('id') id, @Res() res): any {
    const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'audio'
    });

    var trackID = new ObjectID(id);
    let downloadStream = gridFSBucket.openDownloadStream(trackID);
    console.log(downloadStream);
    
    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');
    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('error', () => {
      res.sendStatus(404);
    });

    downloadStream.on('end', () => {
      res.end();
    });
  }
}
