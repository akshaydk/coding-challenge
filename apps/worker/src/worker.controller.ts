import { Controller } from '@nestjs/common';
import { MessagePattern, Ctx, RmqContext, Payload } from '@nestjs/microservices';
import { WorkerService } from './worker.service';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @MessagePattern('add')
  addWorker(@Payload() payload, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    this.workerService.add(payload)
    channel.ack(message);
  }

  @MessagePattern('remove')
  removeWorker(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    this.workerService.remove()
    channel.ack(message);
  }
}
