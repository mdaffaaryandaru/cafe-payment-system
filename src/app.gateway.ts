import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({ namespace: 'events', transports: ['websocket'] })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any): WsResponse<any> {

    return {
      event: 'message',
      data: { message: 'Hello, world!', received: data },
    };
  }

  sendOrderNotification(order: any) {
    this.server.emit('orderCreated', order);
  }
}
