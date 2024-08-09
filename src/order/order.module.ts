import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { DetailOrderan } from './detail-orderan.entity';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { extname, join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppGateway } from 'src/app.gateway';
// import { WebSocketGatewayService } from '../websocket.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, DetailOrderan]),
    MulterModule.register({
      storage: multer.diskStorage({
        destination: './file-transaksi',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'file-transaksi'),
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, AppGateway],
})
export class OrderModule {}
