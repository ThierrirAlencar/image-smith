import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Req, Res } from '@nestjs/common';
import { ImageService } from '../image/image.service';
import { FileService } from './file.service';
import { Response } from 'express';
import { z } from 'zod';
import { FileHandlingError } from 'src/shared/errors/FileHandlingError';

@Controller('file')
export class FileController {
    constructor(
        private ImageService:ImageService,
        private FileHandler:FileService
    ){}
    @Get("")
    async loadFile(@Req() req:Request,@Res() res:Response){
        const {image_id} = z.object({
            image_id:z.string().uuid()
        }).parse(req.body)
    
        try{
            const {original_filename,process_filepath} = await this.ImageService.findOne(image_id)
            
            const a = await this.FileHandler.loadImage(`${process_filepath}/${original_filename}`)
            
            res.status(200).send({
                Description:"Imagem Carregada com sucesso",
                image:a.toString("base64")
            })

        }catch(err){
            if(err instanceof FileHandlingError){
                res.status(404).send({
                    Description:"File not found"
                })
            }else{
                res.status(500).send({
                    Description:"Fle not found",
                    Error:err.message
                })
            }
        }
    }

    @Delete(':path')
    async deleteFile(@Param('path') path: string) {
      try {
        await this.FileHandler.deleteFile(path);
        return {
          statusCode: 200,
          message: 'Arquivo deletado com sucesso',
        };
      } catch (error) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }
  
    // PATCH /files/rename
    @Patch('rename')
    async renameFile(
      @Body() body: { imageId: string; newFileName: string },
    ) {
      const { imageId, newFileName } = body;
  
      if (!imageId || !newFileName) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Parâmetros obrigatórios ausentes: imageId ou newFileName',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
  
      try {
        const newPath = await this.FileHandler.renameFile(imageId, newFileName);
        return {
          statusCode: 200,
          message: 'Arquivo renomeado com sucesso',
          newPath,
        };
      } catch (error) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Erro ao renomear o arquivo',
            error: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
}
