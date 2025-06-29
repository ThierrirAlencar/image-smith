import {
    Body,
    Controller,
    Post,
    Put,
    Delete,
    Get,
    Param,
    Req,
    HttpException,
    HttpStatus,
    UseGuards,
    Res,
  } from '@nestjs/common';
  import { z } from 'zod';
  import { ProcessService } from './process.service';
  import { AuthGuard } from '@nestjs/passport';
  import { EntityNotFoundError } from 'src/shared/errors/EntityDoesNotExistsError';
import { AuthRequest } from 'src/interfaces/authRequest';
import { ImageService } from '../image/image.service';
import { FileService } from '../file/file.service';
import { SupabaseService } from '../supabase/supabase.service';
import { UserService } from '../user/user.service';
import { log } from 'console';
import { Response } from 'express';

enum EffectType {
  None = 0,
  Grayscale,
  Blur,
  Canny,
  Pixelate,
  BGR2RGB,
  BGR2HSV,
  BGR2HLS,
  BGR2LUV,
  RGB_Boost,
  Negative,
  Brightness,
  Skin_Whitening,
  Heat,
  Sepia,
  Cartoon,
  Pencil_Sketch
}

const EffectMap: Record<string, EffectType> = {
  "": EffectType.None,
  Grayscale: EffectType.Grayscale,
  Blur: EffectType.Blur,
  Canny: EffectType.Canny,
  Pixelate: EffectType.Pixelate,
  BGR2RGB: EffectType.BGR2RGB,
  BGR2HSV: EffectType.BGR2HSV,
  BGR2HLS: EffectType.BGR2HLS,
  BGR2LUV: EffectType.BGR2LUV,
  RGB_Boost: EffectType.RGB_Boost,
  Negative: EffectType.Negative,
  Brightness: EffectType.Brightness,
  Skin_Whitening: EffectType.Skin_Whitening,
  Heat: EffectType.Heat,
  Sepia: EffectType.Sepia,
  Cartoon: EffectType.Cartoon,
  Pencil_Sketh: EffectType.Pencil_Sketch, // cuidado aqui, você tinha escrito "Sketh"
};

@Controller('processes')
export class ProcessController {
constructor(
  private processService: ProcessService,
  private ImageService:ImageService,
  private fileHandler:FileService,
  private supabaseService:SupabaseService,
  private userService:UserService
) {}
    @Post()
    async create(@Req() req: AuthRequest, @Body() body: any) {
      const schema = z.object({
        image_id: z.string().uuid(),
        output_filename: z.string().optional(),
        type:z.enum([
          "",
          "Grayscale","Blur","Canny","Pixelate",
          "BGR2RGB","BGR2HSV", "BGR2HLS","BGR2LUV",
          "RGB_Boost","Negative","Brightness","Skin_Whitening",
          "Heat","Sepia","Cartoon","Pencil_Sketch"
        ]).default(""),
        amount:z.object({
          amountR:z.number({message:"Intensidade do efeito aplicado para a cor vermelha (também é usado como intensidade quando as outras cores não são nescessárias)"}),
          amountG:z.number({message:"Intensidade do efeito aplicado para a cor verde"}),
          amountB:z.number({message:"Intensidade do efeito aplicado para a cor azul"})
        })
      });
  
      const {image_id,output_filename,type,amount} = schema.parse(body);
  
      try {
        
        //Find the Image Who we Want to Change
        const {stored_filepath,original_filename,user_id} = await this.ImageService.findOne(image_id)
        //Load User name
        const {name} = await this.userService.userProfile(user_id)
        //Turn the Effect enum to a number
        const effectNumber: EffectType = EffectMap[type];
        //handle the process (calls python)
        const fileFolderResponse = await this.processService.handleProcessEffect(stored_filepath,effectNumber,amount)
        
        // //Upload to Supabase
        //LoadImage Local Buffer (from python saved directory)
        const localFileResponse = await this.fileHandler.loadImage(fileFolderResponse)

        //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
        const publicPathUrl = await this.supabaseService.uploadToSupabase({
          buffer:localFileResponse,
          mimetype:"png",originalname:original_filename
        }, `${name}/${type}` )

        //Create the process as entity registering the sucess of the process operation 
        const created = await this.processService.create({image_id,output_filename:publicPathUrl.public_url,operation:type,});

        //carregar imagem para retornar como base64
        const bufferResult = await this.fileHandler.loadImage(fileFolderResponse)
          // Transforma buffers em base64 e monta data URL
        const base64 = bufferResult.toString('base64'); 

        return {
          statusCode: 201,
          description: 'Processamento criado com sucesso',
          process: created,
          image:base64
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
  
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
      const schema = z.object({
        favorite: z.boolean({description:"Se a operação é favorita ou nao",message:"Precisar se um valor booleano"}).optional(),
        operation: z.string({description:"Descreva a operação realizada",message:"Faça isso em string"}).optional(),
      });
  
      const {favorite:completed ,operation} = schema.parse(body);
  
      try {
        const updated = await this.processService.update(id,{completed,operation});
        return {
          statusCode: 200,
          description: 'Processamento atualizado com sucesso',
          process: updated,
          body:{
            completed,
            operation
          }
        };
      } catch (err) {
        throw new HttpException(
          {
            description: 'Erro ao atualizar processamento',
            error: err.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      try {
        await this.processService.delete(id);
        return {
          statusCode: 200,
          description: 'Processamento deletado com sucesso',
        };
      } catch (err) {
        if (err instanceof EntityNotFoundError) {
          throw new HttpException(
            {
              description: 'Processamento não encontrado',
              error: err.message,
            },
            HttpStatus.NOT_FOUND,
          );
        }
  
        throw new HttpException(
          {
            description: 'Erro ao deletar processamento',
            error: err.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    
    @Get('/unique/:id')
    async getById(@Param('id') id: string) {
      try {
        const process = await this.processService.getById(id);
        return {
          statusCode: 200,
          description: 'Processamento retornado com sucesso',
          process,
        };
      } catch (err) {
        if (err instanceof EntityNotFoundError) {
          throw new HttpException(
            {
              description: 'Processamento não encontrado',
              error: err.message,
            },
            HttpStatus.NOT_FOUND,
          );
        }
  
        throw new HttpException(
          {
            description: 'Erro ao buscar processamento',
            error: err.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    @Get('image/:imageId')
    async getAllByImageId(@Param('imageId') imageId: string) {
      try {
        const processes = await this.processService.getAllByImageId(imageId);
        return {
          statusCode: 200,
          description: 'Lista de processamentos retornada com sucesso',
          processes,
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
            description: 'Erro ao buscar processamentos',
            error: err.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    @Get('recent')
    async getMostRecentByUser(@Req() req: AuthRequest) {
        const { id: userId } = z.object({
            id: z.string().uuid(),
        }).parse(req.user);

        try {
            const result = await this.processService.getMostRecentProcessByUser(userId);

            return {
                statusCode: 200,
                description: 'Último processamento retornado com sucesso',
                process: result,
            };

        } catch (err) {
            if (err instanceof EntityNotFoundError) {
                throw new HttpException({
                    description: 'Usuário não encontrado',
                    error: err.message,
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            if (err instanceof EntityNotFoundError) {
              const notFoundEntity = err.entity
              const notFoundId = err.id
  
              let description = 'Entidade não encontrada'
              if (notFoundEntity === 'User') {
                  description = 'Usuário não encontrado'
              } else if (notFoundEntity === 'ImageProcess' && notFoundId === 'recent') {
                  description = 'Processamento não encontrado'
              }
  
              throw new HttpException({
                  description,
                  error: err.message,
              }, HttpStatus.NOT_FOUND);
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
            
            const images = await this.processService.findFavorite(userId);
      
            res.status(200).send({
              statusCode: 200,
              description: 'Lista de processos favoritos retornada com sucesso',
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
  }
  