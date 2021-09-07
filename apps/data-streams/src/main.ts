import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const initMicroservice = async (app: INestApplication) => {
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'data',
      noAck:false,
    },
  });
  await app.startAllMicroservicesAsync();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initMicroservice(app);
  await app.listen(3000);
}
bootstrap();
