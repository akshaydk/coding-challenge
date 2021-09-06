import { Controller } from '@nestjs/common';
import { MessagePattern, Ctx, RmqContext, Payload } from '@nestjs/microservices';
import { WorkerService } from './worker.service';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}
 
  //ToDo: We could add more RabbitMQ specific operations here.
  @MessagePattern('add')
  addWorker(@Payload() payload, @Ctx() context: RmqContext) {
    this.workerService.add(payload)
  }

  @MessagePattern('remove')
  removeWorker(@Ctx() context: RmqContext) {
    this.workerService.remove()
  }
}
