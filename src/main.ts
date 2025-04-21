import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions } from './shared/lib/swagger';
import { log } from 'console';
import * as express from 'express';

async function bootstrap() {
  const port = process.env.PORT;
  const host = process.env.HOST
  


  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: '*', // ou especificamente: origin: 'http://192.168.0.7:8082'
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  app.use(express.json({limit:"10mb"}));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use((req, res:Response, next) => {
    console.log(`Nova requisição recebida: ${req.method} ${req.url} `);

    log(req.body)
    
    next();
  });

  SwaggerModule.setup("docs",app,swaggerOptions)

  await app.listen(port,host,()=>{
    console.log(`Running on: http://${host}:${port}`)
    console.log(`Através de IPV4 http://${process.env.IPV4_HOST}:${port}/docs`)
  });
}
bootstrap();
