import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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

    it('should add a worker', () => {
      let service = jest
        .spyOn(appService, 'deleteWorker')
        .mockImplementationOnce(() => {});
      appController.deleteWorker();

      expect(service).toHaveBeenCalledTimes(1);
    });
  });
});
