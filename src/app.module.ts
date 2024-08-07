import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuModule } from './menu/menu.module';
import { Menu } from './menu/menu.entity';
import { PegawaiController } from './pegawai/pegawai.controller';
import { PegawaiModule } from './pegawai/pegawai.module';
import { LoggerModule } from 'nestjs-pino';
import { Pegawai } from './pegawai/pegawai.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/order.entity';
import { DetailOrderan } from './order/detail-orderan.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '',
      database: 'seruni_database',
      entities: [Menu, Pegawai, Order, DetailOrderan],
      synchronize: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {},
    }),
    MenuModule,
    PegawaiModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
