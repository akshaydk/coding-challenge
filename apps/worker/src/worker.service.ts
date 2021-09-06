import { HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CreateWorkerDto } from './create-worker.dto';

@Injectable()
export class WorkerService {
  constructor(
    @Inject('DataService') private readonly clientProxy: ClientProxy,
    private readonly httpService: HttpService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  private readonly logger = new Logger();

  add(body: string): void {
    try {
      this.logger.log('Adding a cron worker');

      let data: CreateWorkerDto = JSON.parse(body);
      const job = new CronJob(
        CronExpression.EVERY_5_SECONDS,
        async () => await this.fetch(data['url']),
      );

      /** ToDo:
       * 1. The name should not be hardcoded. Generate a hash or somthing like that.
       * 2. It can also be use to check if a cron already exists.
       */
      this.schedulerRegistry.addCronJob('worker_1', job);
      job.start();

      this.logger.log('Cron job for ' + data['url'] + ' has been scheduled/');
    } catch (err) {
      this.logger.error(err);
    }
  }

  /** ToDo:
   * Get the name in payload and find the corresponding job name.
   */
  remove(): void {
    this.logger.log('Removing a cron worker');
    this.schedulerRegistry.deleteCronJob('worker_1');
  }

  private async fetch(url: string): Promise<void> {
    try {
      let data = await this.httpService.get(url).toPromise();
      this.clientProxy.emit('data', JSON.stringify(data.data));
    } catch (err) {
      this.logger.error(err);
    }
  }
}
