import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions } from './shared/lib/swagger';


async function bootstrap() {
  const port = process.env.PORT;
  const host = process.env.HOST
  
  const app = await NestFactory.create(AppModule);
  
  SwaggerModule.setup("docs",app,swaggerOptions)

  await app.listen(port,host,()=>{
    console.log(`Running on: http://${host}:${port}`)
  });
}
bootstrap();
