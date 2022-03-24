import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsResponse
} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from "@nestjs/common";
import { from, map, Observable } from 'rxjs';
@WebSocketGateway({ cors: true })
@Injectable()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;
  clients: Socket[] = [];
  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    return data;
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.clients.push(client);
  }

  handleDisconnect(client: Socket): any {
    this.clients = this.clients.filter((c) => c.id !== client.id);
  }


  notifyAllClients(event: string, payload: any) {
    this.clients.forEach((c) => {
      c.emit('events', { event, data: payload});
    });
  }
}
