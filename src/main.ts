import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as serveStatic from 'serve-static';
import { option } from 'yargs';

const { argv } = option('port', {
    alias: 'p',
    string: true,
    default: '80',
    describe: "端口号"
})


import Path = require('path')

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
  
    app.enableCors()

    app.use('/' , serveStatic(Path.join(__dirname , '../public')))

    await app.listen( argv.port )
}
bootstrap();
