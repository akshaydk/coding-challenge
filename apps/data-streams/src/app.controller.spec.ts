import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    // There should be a better way to handle the imports
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
        {
          name: 'WorkerService',
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'worker',
            noAck: false,
          },
        },
      ]),],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return the data', () => {
      let expected = {
        foo: 'bar',
      };

      jest.spyOn(appController, 'getData').mockReturnValue(expected);

      expect(appController.get()).toBe(expected);
    });

    it('should add a worker', () => {
      let body = {
        url: 'www.foo.bar',
        frequency: 'EVERY_5_SECONDS',
      };

      let service = jest
        .spyOn(appService, 'addWorker')
        .mockImplementationOnce(() => {});
      appController.startWorker(body);

      expect(service).toHaveBeenCalledTimes(1);
    });

    it('should delete a worker', () => {
      let service = jest
        .spyOn(appService, 'deleteWorker')
        .mockImplementationOnce(() => {});
      appController.deleteWorker();

      expect(service).toHaveBeenCalledTimes(1);
    });
  });
});
