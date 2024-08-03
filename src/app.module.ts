import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuModule } from './menu/menu.module';
import { Menu } from './menu/menu.entity';
import { PegawaiController } from './pegawai/pegawai.controller';
import { PegawaiModule } from './pegawai/pegawai.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '',
      database: 'seruni_database',
      entities: [Menu],
      synchronize: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {},
    }),
    MenuModule,
    PegawaiModule,
  ],
  controllers: [AppController, PegawaiController],
  providers: [AppService],
})
export class AppModule {}
