import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // o '*' para permitir todos los orígenes (más inseguro)
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
