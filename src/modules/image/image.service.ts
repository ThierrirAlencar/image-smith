import { Injectable } from '@nestjs/common';
import { Image, Prisma } from '@prisma/client';
import { EntityNotFoundError } from 'src/shared/errors/EntityDoesNotExistsError';
import { PrismaService } from 'src/shared/prisma/PrismaService';

@Injectable()
export class ImageService {
    constructor(private prismaService:PrismaService){}
    async create(data:Prisma.ImageUncheckedCreateInput):Promise<Partial<Image>>{
        const {original_filename,stored_filepath,user_id} = data
        
        const created = await this.prismaService.image.create({
            data:{
                original_filename,stored_filepath,user_favorite:false,user_id  
            },
            select:{
                user_id:false,
                Id:true,created_at:true,original_filename:true,process_filepath:true,size:true,stored_filepath:true,updated_at:true
            }
        })

        return created;
        
    }

    async findOne(id:string):Promise<Partial<Image>>{
        const doesTheImageExists = await this.prismaService.image.findUnique({
            where:{
                Id:id
            },
            select:{
                user_id:false,
                Id:true,created_at:true,original_filename:true,process_filepath:true,size:true,stored_filepath:true,updated_at:true
            }
        })
        if(!doesTheImageExists){
            throw new EntityNotFoundError("image",id)
        }

        return doesTheImageExists
    }

    async findManyByUserId(userId:string):Promise<Partial<Image>[]>{
        const doesTheUserExists = await this.prismaService.user.findUnique({
            where:{
                id:userId
            },
            select:{
                id:false,email:true,name:true
            }
        })
        if(!doesTheUserExists){
            throw new EntityNotFoundError("User",userId)
        }
        
        const manyList = await this.prismaService.image.findMany({
            where:{
                user_id:userId
            },
            select:{
                user_id:false,
                Id:true,created_at:true,original_filename:true,process_filepath:true,size:true,stored_filepath:true,updated_at:true
            }
        })

        return manyList
    }

    async delete(id:string):Promise<Partial<Image>>{
        const doesTheImageExists = await this.prismaService.image.findUnique({
            where:{
                Id:id
            },
            select:{
                user_id:false,
                Id:true,created_at:true,original_filename:true,process_filepath:true,size:true,stored_filepath:true,updated_at:true
            }
        })
        if(!doesTheImageExists){
            throw new EntityNotFoundError("image",id)
        }

        const deleteFinal = await this.prismaService.image.delete({
            where:{
                Id:id
            }
        })
        return doesTheImageExists
    }
}
