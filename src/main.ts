import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001', // o '*' para permitir todos los orígenes (más inseguro)
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
