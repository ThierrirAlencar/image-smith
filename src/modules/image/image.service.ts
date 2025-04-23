import { Injectable } from '@nestjs/common';
import { Image, Prisma } from '@prisma/client';
import { join } from 'path';
import { EntityNotFoundError } from 'src/shared/errors/EntityDoesNotExistsError';
import { PrismaService } from 'src/shared/prisma/PrismaService';
import { promises as fs } from 'fs';

interface imageUpdateParams{
    imageId:string,
    name:string,
    user_favorite:boolean
}
@Injectable()
export class ImageService {
    protected basePath = join(__dirname, "../../../")
    protected notFoundFilePath = join(this.basePath,"public/Image-not-found.png")
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

    //Retorna as imagens devidamente carregadas como buffers
    async loadImage(imagePath: string): Promise<Buffer> {
    
        try {
          const imageBuffer = fs.readFile(imagePath);
          return imageBuffer;
        } catch (error) {
          const fallbackBuffer = fs.readFile(this.notFoundFilePath);
          return fallbackBuffer;
        }
    }

    //Retorna as imagens favoritas
    async sendFavorites(userId:string):Promise<Partial<Image>[]>{
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
                user_id:userId,
                user_favorite:true
            },
            select:{
                user_id:false,
                Id:true,created_at:true,original_filename:true,process_filepath:true,size:true,stored_filepath:true,updated_at:true
            }
        })

        return manyList

    }

    //Atualiza uma imagem
    async updateImage({imageId,name,user_favorite}:Partial<imageUpdateParams>){
        const doesTheImageExists = await this.prismaService.image.findUnique({
            where:{
                Id:imageId
            },
            select:{
                user_id:false,
                Id:true,created_at:true,original_filename:true,process_filepath:true,size:true,stored_filepath:true,updated_at:true
            }
        })
        if(!doesTheImageExists){
            throw new EntityNotFoundError("image",imageId)
        }

        await this.prismaService.image.update({
            where:{
                Id:imageId
            },
            data:{
                user_favorite,updated_at:new Date()
            }
        })
        return doesTheImageExists
    }
}

