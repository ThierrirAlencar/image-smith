import { Injectable } from '@nestjs/common';
import { dirname, extname, join } from 'path';
import {readFile, readFileSync, rename, renameSync, unlink, unlinkSync} from "fs"
import { FileHandlingError } from 'src/shared/errors/FileHandlingError';
import { PrismaService } from 'src/shared/prisma/PrismaService';
@Injectable()
export class FileService {
    protected basePath = join(__dirname, "../../../")
    protected notFoundFilePath = join(this.basePath,"public/Image-not-found.png")

    constructor(
        private prismaService:PrismaService
    ){}

    async deleteFile(filePathUrl:string){
        const doesTheFileExists = readFileSync(filePathUrl)
        if(doesTheFileExists){
           unlinkSync(filePathUrl)
        }else{
            throw new FileHandlingError("FIle not Found")
        }
    }

    //Retorna as imagens devidamente carregadas como buffers
    async loadImage(imagePath: string): Promise<Buffer> {
        try {
            const imageBuffer = readFileSync(imagePath);
            return imageBuffer;
        } catch (error) {
            const fallbackBuffer = readFileSync(this.notFoundFilePath);
            return fallbackBuffer;
        }
    }

    async renameFile(imageId:string,newFileName:string){
        const {original_filename,process_filepath} = await this.prismaService.image.findUnique({
            where:{
                Id:imageId
            }
        })
        const imagePath = `${process_filepath}/${original_filename}`
        try {
            const dir = dirname(imagePath);
            const ext = extname(imagePath);

            const newPath = join(dir, newFileName);
    
            renameSync(imagePath, newPath);

            const updateImage = await this.prismaService.image.update({
                where:{
                    Id:imageId
                },
                data:{
                    original_filename:newFileName
                }
            })

            return newPath;
        } catch (error) {
            console.error('Erro ao renomear o arquivo:', error);
            throw new Error('Falha ao renomear o arquivo');
        }

    }
}
