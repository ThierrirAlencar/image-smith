import { Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UniqueKeyViolationError } from 'src/shared/errors/UniqueKeyViolationError';
import { stat } from 'fs';
import { z } from 'zod';
import { EntityNotFoundError } from 'src/shared/errors/EntityDoesNotExistsError';

@Controller('user')
export class UserController {
    constructor(private userService:UserService){}

    @Post("")
    async create(@Req() req:Request){
        const {Email,Password,userName} = z.object({
            Email:z.string({message:"Por favor informe um Email"}).email("Por favor informe um Email válido"),
            Password:z.string({message:"Por favor iforme uma senha"}).min(6,"deve ter no mínimo 6 caracteres"),
            userName:z.string({message:"Por favor informe um nome"})
        }).parse(req.body)
        
        try{
            const response  = await this.userService.create({email:Email,name:userName,password:Password,role:'User'})
            
            return{
                statusCode:201,
                description:"Usuário criado com sucesso",
                User:response.name
            }
        }catch(err){
            if(err instanceof UniqueKeyViolationError){
                throw new HttpException(
                    {
                      description: 'Chave única já está em uso (Email)',
                      error: err.message,
                    },
                    HttpStatus.CONFLICT,
                  );
            }else{
                throw new HttpException(
                    {
                        description:"Erro desconhecido",
                        error:err.message
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }
        }
    }

    @Post('login')
    async login(@Req() req: Request) {
      const { Email, Password } = z
        .object({
          Email: z
            .string({ message: 'Por favor informe um Email' })
            .email('Por favor informe um Email válido'),
          Password: z.string({ message: 'Informe a senha' }),
        })
        .parse(req.body);
  
      try {
        const response = await this.userService.login(Email, Password);
  
        return {
          statusCode: 200,
          description: 'Login realizado com sucesso',
          userId: response.userId,
        };
      } catch (err) {
        if (err instanceof EntityNotFoundError) {
          throw new HttpException(
            {
              description: 'Email não encontrado',
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
  
    @Get(':id')
    async profile(@Param('id') id: string) {
      try {
        const profile = await this.userService.userProfile(id);
  
        return {
          statusCode: 200,
          description: 'Perfil encontrado com sucesso',
          user: profile,
        };
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
  
    @Patch(':id')
    async update(@Param('id') id: string, @Req() req: Request) {
      const bodySchema = z.object({
        email: z.string().email().optional(),
        name: z.string().optional(),
        password: z.string().min(6).optional(),
        role: z.enum(['User', 'Admin']).optional(),
      });
  
      const data = bodySchema.parse(req.body);
  
      try {
        const updated = await this.userService.update(id, data);
  
        return {
          statusCode: 200,
          description: 'Usuário atualizado com sucesso',
          user: updated,
        };
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
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      try {
        await this.userService.delete(id);
  
        return {
          statusCode: 200,
          description: 'Usuário deletado com sucesso',
        };
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
