import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { pusher } from './pusher.config';

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
  handleMessage(@MessageBody() order: any) {
    pusher.trigger('my-channel', 'my-event', {
      message: order,
    });
  }

  @SubscribeMessage('orderNotificationCustomer')
  handleMessageCustomer(@MessageBody() updatedOrder: any) {
    pusher.trigger('my-channel-customer', 'my-event-customer', {
      message: updatedOrder,
    });
  }
}
