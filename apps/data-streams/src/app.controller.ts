import { Body, Controller, Delete, Get, Logger, Post } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateWorkerDto } from './create-worker.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger();
  private data = [];

  //ToDo: Return the data
  @Get('/data')
  get() {
    return this.getData();
  }

  @Post('/worker')
  startWorker(@Body() body: CreateWorkerDto): void {
    this.logger.log('Adding a cron worker to ' + body.url);
    this.appService.addWorker(body);
  }

  @Delete('/worker')
  deleteWorker(): void {
    this.appService.deleteWorker();
  }

  //ToDo: Save the data
  @EventPattern('data')
  handleDataEvent(@Payload() payload, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    this.data.push(payload);
    channel.ack(message);
  }

  getData(): {} {
    return this.data;
  }
}
