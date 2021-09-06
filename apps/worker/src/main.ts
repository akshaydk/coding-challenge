import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'], // Can be picked up from environment variables.
        queue: 'worker',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  app.listen(async () => {
    console.log('Worker microservice is starting!');
  });
}

bootstrap();
