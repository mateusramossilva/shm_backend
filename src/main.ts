import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Libera o CORS para o Frontend (Netlify) conseguir conversar com a API
  app.enableCors({
    origin: '*', // Depois, por segurança, você pode trocar '*' pela URL do Netlify
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // 2. O Fly.io exige que o host seja '0.0.0.0' e injeta a porta automaticamente
  const port = process.env.PORT || 3002;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 BACKEND RODANDO NA PORTA: ${port}`);
}
bootstrap();