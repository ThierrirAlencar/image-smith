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
  } from '@nestjs/common';
  import { z } from 'zod';
  import { ProcessService } from './process.service';
  import { AuthGuard } from '@nestjs/passport';
  import { EntityNotFoundError } from 'src/shared/errors/EntityDoesNotExistsError';
import { AuthRequest } from 'src/interfaces/authRequest';

  
@Controller('processes')
export class ProcessController {
constructor(private processService: ProcessService) {}
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
          "Heat","Sepia","Cartoon","Pencil_Sketh"
        ]).default("")
      });
  
      const {image_id,output_filename,type} = schema.parse(body);
  
      try {
        const created = await this.processService.create({image_id,output_filename});
        return {
          statusCode: 201,
          description: 'Processamento criado com sucesso',
          process: created,
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
        completed: z.boolean({description:"Se foi concluído ou nao",message:"Precisar se um valor booleano"}).optional(),
        operation: z.string({description:"Descreva a operação realizada",message:"Faça isso em string"}).optional(),
      });
  
      const {completed,operation} = schema.parse(body);
  
      try {
        const updated = await this.processService.update(id, {completed,operation});
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
  
    @Get(':id')
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
  