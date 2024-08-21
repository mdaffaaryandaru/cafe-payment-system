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
    TypeOrmModule.forFeature([Menu, Toping]),
    MulterModule.register({
      storage: multer.diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
    }),
  ],
  providers: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}
