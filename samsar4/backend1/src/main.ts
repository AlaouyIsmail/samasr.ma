import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: process.env.FRONTEND_URL || '*', credentials: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  const cfg = new DocumentBuilder()
    .setTitle('SAMSAR API v2')
    .setDescription(`
# SAMSAR — SaaS Immobilier Marocain

## Comptes de test (après npm run seed)
| Rôle | Email | Password |
|------|-------|----------|
| Admin | admin@samsar.ma | admin123 |
| Agent actif | karim@samsar.ma | agent123 |
| Agent actif | fatima@samsar.ma | agent123 |
| Agent inactif | youssef@samsar.ma | agent123 |

## Flux de test
1. **POST /api/auth/login** → copier le token
2. Cliquer **Authorize** → coller le token
3. **GET /api/agent/dashboard** → voir stats
4. **POST /api/properties** → créer annonce
5. **POST /api/contracts** → générer contrat
    `)
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, cfg));

  await app.listen(process.env.PORT || 3001);
  console.log(`🏡 SAMSAR API → http://localhost:${process.env.PORT || 3001}/api`);
  console.log(`📚 Swagger → http://localhost:${process.env.PORT || 3001}/api/docs`);
}
bootstrap();
