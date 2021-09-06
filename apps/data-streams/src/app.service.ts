import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateWorkerDto } from './create-worker.dto';

@Injectable()
export class AppService {
  constructor(@Inject('WorkerService') private readonly clientProxy:  ClientProxy) { }
  
  //ToDo: We could add more RabbitMQ specific operations here. Sending Ack and more.
  addWorker(body: CreateWorkerDto):void{
    console.log("Emitting an event")
    this.clientProxy.emit('add',JSON.stringify(body))
  }

  stopWorker():void{
    this.clientProxy.emit('remove',JSON.stringify({}))
  }
}
