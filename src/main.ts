import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

config();



async function bootstrap() {
  const app = await NestFactory.create(AppModule , {
    rawBody: true,
    bodyParser: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.use(helmet());

  app.enableCors({
    origin: "http://localhost:3000"
  })

  //* Swagger setup
  //* http://localhost:5000/swagger
  const swagger = new DocumentBuilder()
    .setTitle("Hotel Management System - App API")
    .setDescription("Your API description")
    .addServer("http://localhost:5000")
    .setTermsOfService("http://localhost:5000/terms-of-service")
    .setLicense("MIT License", "https://google.com")
    .setVersion("1.0")
    .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
    .addBearerAuth()
    .build();


  const documentation = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('swagger', app, documentation)
  await app.listen(process.env.PORT || 5001);
}
bootstrap();
