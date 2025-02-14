import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateWorkerDto } from './create-worker.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('WorkerService') private readonly clientProxy: ClientProxy,
  ) {}

  addWorker(body: CreateWorkerDto): void {
    this.clientProxy.emit('add', JSON.stringify(body));
  }

  deleteWorker(): void {
    this.clientProxy.emit('remove', JSON.stringify({}));
  }
}
