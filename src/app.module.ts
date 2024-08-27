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
        type: 'mysql', // Set the database type to MySQL
        host: '127.0.0.1', // Set the host to localhost
        port: 3306, // Set the default MySQL port
        username: 'root', // Set the default MySQL username
        password: '', // Set the password (replace with your actual password)
        database: 'seruni_database', // Set the database name (replace with your actual database name)
        entities: [Menu, Pegawai, Order, DetailOrderan, Toping],
        synchronize: true,
        ssl: false, // Disable SSL for local development
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
