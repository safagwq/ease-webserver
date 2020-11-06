import { Controller, Get, HttpException, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import Path = require('path')
import fs = require('fs')

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get('api/*')
    getApi( @Req() req : Request) {
        const reqPath = req.path.replace(/^\/api/, '')
        const nativePath = Path.join( __dirname , '../public' , reqPath )

        if( ! fs.existsSync( nativePath ) ){
            throw new HttpException(req.path + 'not found !' , 404)
        }

        return this.getLinksFromPath(reqPath)
    }


    @Get('*')
    getAny( @Res() res:Response) {
        res.sendFile( Path.join( __dirname , '../' , 'index.html' ) )
    }


    getLinksFromPath(reqPath:string){
        const nativePath = Path.join( __dirname , '../public' , reqPath )
        const filenames = fs.readdirSync(nativePath).filter(file=>file[0]!=='.')
        
        if(reqPath!=='/'){
            filenames.unshift('../')
        }

        return filenames.map((name)=>{
            const state = fs.statSync( Path.join(nativePath , name) )
            const isFile = state.isFile()
            const size = state.size

            return {
                isFile,
                size,
                name,
                url : Path.join(reqPath , name).replace(/\\/g, '/')
            }
        })
    }
}
