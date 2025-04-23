import {
    Controller,
    Post,
    Get,
    Delete,
    Req,
    UseGuards,
    HttpException,
    HttpStatus,
    UseInterceptors,
    UploadedFile,
    Res,
    Put,
  } from '@nestjs/common';
  import { ImageService } from './image.service';
  import { AuthGuard } from '@nestjs/passport';
  import { z } from 'zod';
import { AuthRequest } from 'src/interfaces/authRequest';
import { EntityNotFoundError } from 'src/shared/errors/EntityDoesNotExistsError';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { log } from 'console';
import { join } from 'path';
import { diskStorage } from 'multer';
  
@Controller('images')
export class ImageController {
    constructor(private imageService: ImageService, private authService:AuthService) {}
  
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor("file",{
      fileFilter: (req, file, cb) => {
        console.log(file)
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
        }
        cb(null, true);
      },
      storage:diskStorage({
                          destination: './uploads/uploaded', // Diretório onde as imagens serão salvas
                          filename: (req, file, cb) => {
                              const uniqueSuffix = `${Date.now()}`;
                              cb(null, `${uniqueSuffix}.png`); // Salvando como PNG
                          },
                      }),
    }))
    @Post('')
    async uploadImage(@Req() req: AuthRequest,@UploadedFile() file:Express.Multer.File) {
      const { id: userId } = z
        .object({ id: z.string().uuid() })
        .parse(req.user);
  
      const {
            destination:stored_filepath,
            filename:original_filename
        } = file
  
      try {
        const result = await this.imageService.create({
            original_filename,stored_filepath:stored_filepath+original_filename,user_favorite:false,user_id:userId
        });
  
        return {
          statusCode: 201,
          description: 'Imagem enviada com sucesso',
          image: result,
        };
      } catch (err) {
        throw new HttpException(
          {
            description: 'Erro ao salvar imagem',
            error: err.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    @UseGuards(AuthGuard('jwt'))
    @Get('')
    async listByUser(@Req() req: AuthRequest, @Res() res:Response) {
      const userId = req.user.id;

      log(userId)
      
      try {
        
        const images = await this.imageService.findManyByUserId(userId);
  
        res.status(200).send({
          statusCode: 200,
          description: 'Lista de imagens retornada com sucesso',
          images,
        });
      } catch (err) {
        if (err instanceof EntityNotFoundError) {
          throw new HttpException(
            {
              description: 'Usuário não encontrado',
              error: err.message,
            },
            HttpStatus.NOT_FOUND,
          );
        }
  
        throw new HttpException(
          {
            description: 'Erro desconhecido',
            error: err.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('favorite')
    async listByFavorite(@Req() req: AuthRequest, @Res() res:Response) {
      const userId = req.user.id;

      log(userId)
      
      try {
        
        const images = await this.imageService.findManyByUserId(userId);
  
        res.status(200).send({
          statusCode: 200,
          description: 'Lista de imagens retornada com sucesso',
          images,
        });
      } catch (err) {
        if (err instanceof EntityNotFoundError) {
          throw new HttpException(
            {
              description: 'Usuário não encontrado',
              error: err.message,
            },
            HttpStatus.NOT_FOUND,
          );
        }
  
        throw new HttpException(
          {
            description: 'Erro desconhecido',
            error: err.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    @Put("")
    async updateImage(@Req() req: AuthRequest) {
      const {user_favorite,imageId} = z.object({
        imageId:z.string().uuid(),
        user_favorite:z.boolean().default(false)
      }).parse(req.body)

      try {
        const result = await this.imageService.updateImage({
           imageId,name:"",user_favorite
        });
  
        return {
          statusCode: 201,
          description: 'Imagem atualizada com sucesso',
          image: result,
        };
      } catch (err) {
        throw new HttpException(
          {
            description: 'Erro ao salvar imagem',
            error: err.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    @UseGuards(AuthGuard('jwt'))
    @Get('')
    async getOne(@Req() req: AuthRequest) {
      const { id } = z
        .object({ id: z.string().uuid() })
        .parse(req.user);
  
      try {
        const image = await this.imageService.findOne(id);
  
        return {
          statusCode: 200,
          description: 'Imagem retornada com sucesso',
          image,
        };
      } catch (err) {
        if (err instanceof EntityNotFoundError) {
          throw new HttpException(
            {
              description: 'Imagem não encontrada',
              error: err.message,
            },
            HttpStatus.NOT_FOUND,
          );
        }
  
        throw new HttpException(
          {
            description: 'Erro desconhecido',
            error: err.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    @UseGuards(AuthGuard('jwt'))
    @Delete('')
    async delete(@Req() req: AuthRequest) {
      const { id } = z
        .object({ id: z.string().uuid() })
        .parse(req.user);
  
      try {
        const deleted = await this.imageService.delete(id);
  
        return {
          statusCode: 200,
          description: 'Imagem deletada com sucesso',
          image: deleted,
        };
      } catch (err) {
        if (err instanceof EntityNotFoundError) {
          throw new HttpException(
            {
              description: 'Imagem não encontrada',
              error: err.message,
            },
            HttpStatus.NOT_FOUND,
          );
        }
  
        throw new HttpException(
          {
            description: 'Erro desconhecido',
            error: err.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
}
  