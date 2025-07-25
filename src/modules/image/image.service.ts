import { Injectable } from '@nestjs/common';
import { Image, Prisma } from '@prisma/client';
import { join } from 'path';
import { PrismaService } from '../../shared/prisma/PrismaService';
import { EntityNotFoundError } from '../../shared/errors/EntityDoesNotExistsError';

interface imageUpdateParams{
    imageId:string,
    name:string,
    user_favorite:boolean
}
enum type{ 
    uploaded,
    processed
}
interface image{
    public_url:string,
    type:type,
    id:string,
    date:Date,
    favorite:boolean,
    filename:string
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
                user_id:true,
                Id:true,created_at:true,original_filename:true,process_filepath:true,size:true,stored_filepath:true,updated_at:true
            }
        })
        if(!doesTheImageExists){
            throw new EntityNotFoundError("image",id)
        }

        return doesTheImageExists
    }

    async findManyByUserId(userId: string): Promise<{
        entity_list: Partial<Image>[],
        images: image[]
        }> 
    {
        const doesTheUserExists = await this.prismaService.user.findUnique({
            where: {
            id: userId
            },
            select: {
            email: true,
            name: true
            }
        });

        if (!doesTheUserExists) {
            throw new EntityNotFoundError("User", userId);
        }

        const entity_list = await this.prismaService.image.findMany({
            where: {
                user_id: userId
            },
            select: {
                Id: true,
                original_filename: true,
                stored_filepath: true,
                process_filepath: true,
                size: true,
                created_at: true,
                updated_at: true,
                user_favorite: true
            }
        });

        const images: image[] = [];

        for (const e of entity_list) {
            const loadList = await this.prismaService.image_processing.findMany({
                where: {
                    image_id: e.Id
                }
            });

            const processLoadList: image[] = loadList.map(ee => ({
                public_url: ee.output_filename,
                date: ee.created_at,
                favorite: ee.completed,
                id: ee.id,
                type: type.processed,
                filename:ee.operation
            }));

            images.push({
                date: e.created_at,
                favorite: e.user_favorite,
                id: e.Id,
                public_url: e.stored_filepath,
                type: type.uploaded,
                filename:e.original_filename
            }, ...processLoadList);
        }

        return {
            entity_list,
            images
        };
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
        //Deleta a lista de alterações relativa a imagem
        await this.prismaService.image_processing.deleteMany({
            where:{
                image_id:id
            }
        })
        const deleteFinal = await this.prismaService.image.delete({
            where:{
                Id:id
            }
        })
        return doesTheImageExists
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

