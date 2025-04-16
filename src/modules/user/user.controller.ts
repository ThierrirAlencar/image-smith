import { Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UniqueKeyViolationError } from 'src/shared/errors/UniqueKeyViolationError';
import { stat } from 'fs';
import { z } from 'zod';
import { EntityNotFoundError } from 'src/shared/errors/EntityDoesNotExistsError';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { AuthRequest } from 'src/interfaces/authRequest';

@Controller('user')
export class UserController {
    constructor(private userService:UserService,private authService:AuthService){}

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
        
        const token = await this.authService.generateToken({id:response.userId});
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
    @UseGuards(AuthGuard("jwt"))
    @Get('')
    async profile(@Req() req:AuthRequest) {
      const {id} = z.object({
        id:z.string().uuid()
      }).parse(req.user)
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

    @UseGuards(AuthGuard("jwt"))
    @Put('')
    async update(@Req() req:AuthRequest) {
      const {id} = z.object({
        id:z.string().uuid()
      }).parse(req.user)
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

    @UseGuards(AuthGuard("jwt"))
    @Delete('')
    async delete(@Req() req:AuthRequest) {
      const {id} = z.object({
        id:z.string().uuid()
      }).parse(req.user)

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
