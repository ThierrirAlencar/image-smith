import { Injectable } from "@nestjs/common";
import { Multer } from "multer";
import { FileHandlingError } from "src/shared/errors/FileHandlingError";
import { supabase } from "src/shared/lib/supabase.client";
import { ImageService } from "../image/image.service";
import { PrismaService } from "src/shared/prisma/PrismaService";
import { EntityNotFoundError } from "src/shared/errors/EntityDoesNotExistsError";
import { createWriteStream } from "fs";
import { pipeline } from "stream";

interface File{
    buffer:Buffer,
    mimetype:string,
    originalname:string
}
@Injectable()
export class SupabaseService {
    constructor(private prismaService:PrismaService){}
    async uploadToSupabase(file:File,path:string) {
        const fileName = `${Date.now()}-${file.originalname}`;
        console.log(file.originalname, file.mimetype, file.buffer);
        const blob = new Blob([file.buffer], { type: file.mimetype });

        const { data, error } = await supabase
            .storage
            .from('main') // nome do bucket
            .upload(`${path}/${fileName}`, blob, {
              contentType: file.mimetype,
              upsert: true,duplex:"half"
        });
    
        if (error) {
            throw new FileHandlingError('Erro ao subir arquivo para Supabase');
        }
    
        const publicUrl = supabase
            .storage
            .from('main')
            .getPublicUrl(`${path}/${fileName}`).data.publicUrl;
    
        return {
            original_filename: file.originalname,
            stored_filepath: fileName,
            public_url: publicUrl
        };
    }

    async downloadFromSupabase(imageId:string){
        //Checa se a imagem existe
        const doesTheImageExist = await this.prismaService.image.findUnique({
            where:{
                Id:imageId
            }
        })

        if(!doesTheImageExist){
            throw new EntityNotFoundError("image",imageId)
        }

        const {stored_filepath:filepath} = doesTheImageExist
        //Recebe o arquivo do supabase
        const { data, error } = await supabase.storage.from('main').download('1746986696123-Captura.png');

        if (error) throw error;

        const writeStream = createWriteStream('./downloads/Captura.png');
        await pipeline(data as any, writeStream);
        
    }
    async deleteFromSupabase(imageId:string){
        //Checa se a imagem existe
        const doesTheImageExist = await this.prismaService.image.findUnique({
            where:{
                Id:imageId
            }
        })

        if(!doesTheImageExist){
            throw new EntityNotFoundError("image",imageId)
        }

        const {stored_filepath:filepath} = doesTheImageExist
        //Deleta o arquivo do supabase
        const { data, error } = await supabase.storage.from('main').remove([filepath]);
        if(error) throw error;

        return {
            status:"Deleted Sucessfully",
            data
        }
    }
}
