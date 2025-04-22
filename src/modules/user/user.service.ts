import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, role, User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { EntityNotFoundError } from 'src/shared/errors/EntityDoesNotExistsError';
import { InvalidPasswordError } from 'src/shared/errors/InvalidPasswordErorr';
import { UniqueKeyViolationError } from 'src/shared/errors/UniqueKeyViolationError';
import { PrismaService } from 'src/shared/prisma/PrismaService';




export interface userInService{
    email:string,
    name:string,
    role:role
}

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService){}

    async create(data:Prisma.UserCreateInput):Promise<userInService>{
        const {email,name,password,role} = data
        const doesTheUserAlreadyExists = await this.prisma.user.findUnique({
            where:{
                email
            }
        })

        if(doesTheUserAlreadyExists){
            throw new UniqueKeyViolationError("User");
        }
        const hashPassword = await hash(password,9);
        const createdUser = await this.prisma.user.create({
            data:{
                email,name,password:hashPassword,role
            },
            select:{
                email:true,name:true,role:true
            }
        })

        return createdUser
    }

    async userProfile(userId:string):Promise<userInService>{
        const doesTheUserExists = await this.prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                email:true,name:true,role:true
            }
        })

        if(!doesTheUserExists){

            throw new EntityNotFoundError("User",userId);
        }

        return doesTheUserExists;
    }

    async update(userId: string, data: Partial<User>): Promise<userInService> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        const {password,email,name,role} = data;
        var hashPassword = password
        if (!user) {
            throw new EntityNotFoundError('User', userId);
        }

        if(password){
            hashPassword = await hash(password,90)
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data:{
                email,password:hashPassword,name,role
            },
            select: {
                email: true, name: true, role: true,
            },
        });

        return updatedUser;
    }

    async delete(userId: string): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new EntityNotFoundError('User', userId);
        }

        await this.prisma.user.delete({
            where: { id: userId },
        });
    }
    async login(email:string, password:string){
        const doesTheUserExists = await this.prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!doesTheUserExists){
            throw new EntityNotFoundError("user",email)
        }
        
        const doesThePasswordMatch = await compare(password,doesTheUserExists.password)

        if(!doesThePasswordMatch){
            throw new InvalidPasswordError(email)
        }
        console.log("Chegou aqui")
        return{
            userId:doesTheUserExists.id
        }
    }
}
