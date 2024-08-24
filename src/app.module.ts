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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TopingModule } from './toping/toping.module';
import { Toping } from './toping/entities/toping.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModule => ({
        type: configService.get<'mysql'>('DB_TYPE'), // Pastikan tipe ini sesuai dengan yang didukung oleh TypeORM
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Menu, Pegawai, Order, DetailOrderan, Toping],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    MenuModule,
    PegawaiModule,
    OrderModule,
    TopingModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
