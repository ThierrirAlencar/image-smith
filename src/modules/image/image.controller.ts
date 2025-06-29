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
    Param,
  } from '@nestjs/common';
  import { ImageService } from './image.service';
  import { AuthGuard } from '@nestjs/passport';
  import { z } from 'zod';
import { AuthRequest } from 'src/interfaces/authRequest';
import { EntityNotFoundError } from 'src/shared/errors/EntityDoesNotExistsError';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { log } from 'console';
import { join } from 'path';
import { diskStorage, memoryStorage } from 'multer';
import { SupabaseService } from '../supabase/supabase.service';
import { UserService } from '../user/user.service';
  
@Controller('images')
export class ImageController {
    constructor(
      private imageService: ImageService,
      private supabaseService:SupabaseService,
      private userService:UserService

    ) {}
  
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor("file",{
      fileFilter: (req, file, cb) => {
        console.log(file)
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
        }
        cb(null, true);
      },
      storage:memoryStorage(),
      limits:{
        fileSize:5*1000000,//5mb
      }
    }))
    @Post('')
    async uploadImage(@Req() req: AuthRequest,@UploadedFile() file:Express.Multer.File) {
      const { id: userId } = z
        .object({ id: z.string().uuid() })
        .parse(req.user);
      //Loads User for Storage
      const user = await this.userService.userProfile(userId)

      //Uploads the Image to the S3 Supabase Bucket
      const {original_filename,public_url:stored_filepath} = await this.supabaseService
                                                                    .uploadToSupabase({
                                                                      buffer:file.buffer,mimetype:file.mimetype,originalname:file.originalname
                                                                    },`${user.name}/images`)
  
      try {
        console.log(stored_filepath)
        const {
          Id,
          created_at,
          original_filename:result_fileName,
          process_filepath:result_process_filePath,
          size,
          stored_filepath:result_stored_filePath,
          updated_at} = await this.imageService.create({
            original_filename,
            stored_filepath,
            user_favorite:false,
            user_id:userId
        });
  
        return {
          statusCode: 201,
          description: 'Imagem enviada com sucesso',
          image: {
            Id,
            created_at,
            original_filename:result_fileName,
            process_filepath:result_process_filePath,
            size,
            stored_filepath:result_stored_filePath,
            updated_at
          },
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

      
      try {
        
        const images = await this.imageService.findManyByUserId(userId);
  
        res.status(200).send({
          statusCode: 200,
          description: 'Lista de imagens retornada com sucesso',
          images:images.entity_list,
          simplified:images.images
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
    @Get(':id')
    async getOne(@Param("id") id: string) {
      
      try {
        const {Id,created_at,original_filename,process_filepath,size,stored_filepath,updated_at,user_favorite} = await this.imageService.findOne(id);
  
        return {
          statusCode: 200,
          description: 'Imagem retornada com sucesso',
          image:{
            Id,created_at,original_filename,process_filepath,size,stored_filepath,updated_at,user_favorite
          },
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
    @Delete(':id')
    async delete(@Req() req: Request) {
      const { id } = z
        .object({ id: z.string().uuid() })
        .parse(req.params);
  
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
  