import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Menu } from './menu.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { extname, join } from 'path';
import * as multer from 'multer';
import { Toping } from 'src/toping/entities/toping.entity';

@Module({
  imports: [
    //Mengimport Menu dan Toping dari entities
    TypeOrmModule.forFeature([Menu, Toping]),
    //Menggunakan multer untuk upload file
    MulterModule.register({
      //Konfigurasi storage
      storage: multer.diskStorage({
        //  Konfigurasi destinasi file
        destination: './files',
        //  Konfigurasi nama file
        filename: (req, file, cb) => {
          //  Konfigurasi nama file
          const uniqueSuffix =
            //  Konfigurasi nama file
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          //  Konfigurasi nama file
          const fileExt = extname(file.originalname);
          //  Konfigurasi nama file
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
    //  Konfigurasi rootPath
    ServeStaticModule.forRoot({
      //  Konfigurasi rootPath
      rootPath: join(__dirname, '..', 'files'),
    }),
  ],
  //  Menyediakan MenuService
  providers: [MenuService],
  //  Menyediakan MenuController
  controllers: [MenuController],
})
export class MenuModule {}
