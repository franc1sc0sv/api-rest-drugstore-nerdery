import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  providers: [CloudinaryProvider, ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
