import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WsResponse,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('orderNotification')
  handleMessage(@MessageBody() message: any) {
    this.logger.log(`Message received: ${message}`);
    this.server.emit('orderNotification', message);
  }

  @SubscribeMessage('order')
  sendOrderNotification(@MessageBody() order: any) {
    return { event: 'order', data: order };
  }

  sendNotification(order: any) {
    this.server.emit('order', order);
  }
}
