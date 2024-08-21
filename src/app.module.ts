import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuModule } from './menu/menu.module';
import { Menu } from './menu/menu.entity';
import { PegawaiController } from './pegawai/pegawai.controller';
import { PegawaiModule } from './pegawai/pegawai.module';
import { Pegawai } from './pegawai/pegawai.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/order.entity';
import { DetailOrderan } from './order/detail-orderan.entity';
// import { WebSocketGatewayService } from './websocket.gateway';
import { AppGateway } from './app.gateway';
import { ConfigModule } from '@nestjs/config';
import { TopingModule } from './toping/toping.module';
import { Toping } from './toping/entities/toping.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '',
      database: 'seruni_database',
      entities: [Menu, Pegawai, Order, DetailOrderan, Toping],
      synchronize: true,
    }),
    MenuModule,
    PegawaiModule,
    OrderModule,
    TopingModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
