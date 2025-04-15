import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const port = process.env.PORT;
  const host = process.env.HOST
  
  const app = await NestFactory.create(AppModule);
  
  await app.listen(port,host,()=>{
    console.log(`Running on: http://${host}:${port}`)
  });
}
bootstrap();
