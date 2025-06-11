import { Injectable } from '@nestjs/common';
import { Image, image_processing, Prisma } from '@prisma/client';
import { join } from 'path';
import { EntityNotFoundError } from '../..//shared/errors/EntityDoesNotExistsError';
import { PrismaService } from '../../shared/prisma/PrismaService';
import { promises as fs } from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';

interface amountLike{
    amountR?:number,
    amountG?:number,
    amountB?:number
}

interface transformLike{
    p1:number,
    p2:number,
    p3:number,
    p4:number
}
@Injectable()
export class ProcessService {
    protected basePath = join(__dirname, "../../../")
    protected notFoundFilePath = join(this.basePath,"public/Image-not-found.png")
    constructor(private prisma:PrismaService){}
    
    async create(data:Prisma.image_processingUncheckedCreateInput):Promise<image_processing>{
        const doesTheImageExists = await this.prisma.image.findUnique({
            where:{
                Id:data.image_id
            }
        })
        if(!doesTheImageExists){
            throw new EntityNotFoundError("Image",data.image_id)
        }

        const Process = await this.prisma.image_processing.create({
            data,
        })

        return Process
    }

    async update(id: string, data: Prisma.image_processingUpdateInput):Promise<image_processing>{
        const Process = await this.prisma.image_processing.update({
            data,
            where:{
                id
            },
        })

        return Process
    }

    async delete(id: string):Promise<void>{
        const doesTheProcessExists = await this.prisma.image_processing.findUnique({
            where:{
                id
            }
        })
        if(!doesTheProcessExists){
            throw new EntityNotFoundError("ImageProcess",id)
        }

        await this.prisma.image_processing.delete({
            where:{
                id
            }
        })
    }

    async getById(id: string):Promise<image_processing>{
        const Process = await this.prisma.image_processing.findUnique({
            where:{
                id
            },
        })

        if(!Process){
            throw new EntityNotFoundError("ImageProcess",id)
        }

        return Process
    }

    async getAllByImageId(imageId: string):Promise<image_processing[]>{
        const doesTheImageExists = await this.prisma.image.findUnique({
            where:{
                Id:imageId
            }
        })
        if(!doesTheImageExists){
            throw new EntityNotFoundError("Image",imageId)
        }

        return await this.prisma.image_processing.findMany({
            where:{
                image_id:imageId
            },
        })
    }

    async getMostRecentProcessByUser(userId:string):Promise<image_processing[]>{
        const doesTheUserExists = await this.prisma.user.findUnique({
            where:{
                id:userId
            }
        })

        if(!doesTheUserExists){
            throw new EntityNotFoundError("User",userId)
        }
        var AllProcesses:image_processing[] = []

        const userAllList = await this.prisma.image.findMany({
            where:{
                user_id:userId
            },
            select:{
                user_id:false,
            }
        })
        await Promise.all(
            userAllList.map(async(item) => {
                const {Id} = item as Image
                const loadList = await this.prisma.image_processing.findMany({
                    where:{
                        image_id:Id
                    }
                })

                AllProcesses = AllProcesses.concat(loadList)
            }
        ))
        
        //Retorna a lista de Processos baseados no último processo realizado
        return AllProcesses.sort((a, b) => b.created_at.getTime() - a.created_at.getTime()).slice(0, 1)

    }

    async handleProcessEffect(imagePathRelative: string, effectIndex: number,amount:amountLike): Promise<string> {
        //transforms the file Path (unescessary in a supabase online Context)
        //const filePath = join(this.basePath, imagePathRelative);

        //Turns exec into an async promise
        const execAsync = promisify(exec)
        
        //Separates the RGB values from amount
        const {amountB:B,amountG:G,amountR:R} = amount


        //The command to be executed
        const command = `python3 ${join(this.basePath, 'src', 'Generators', 'Effects', 'Effects.py')} ${imagePathRelative} ${effectIndex} ${R} ${G} ${B}`
      
        console.log(`running: ${command}`);
      
        //Tries to run the command

        try {
            //Executes the Python script and checks if it's output
            const { stdout } = await execAsync(command);

            console.log('Python stdout:', stdout);


            return stdout.trim(); // retorna apenas o texto da saída
        } catch (error) {
          console.error('Erro ao executar script Python:', error);
          throw new Error('Erro ao processar efeito na imagem.');
        }
    }
    async handleTransformation(imagePathRelative: string, transformIndex: number,amount:transformLike): Promise<string> {
        //transforms the file Path (unescessary in a supabase online Context)
        //const filePath = join(this.basePath, imagePathRelative);

        //Turns exec into an async promise
        const execAsync = promisify(exec)
        
        //Separates the RGB values from amount
        const {p1:A,p2:B,p3:C,p4:D} = amount


        //The command to be executed
        const command = `python3 ${join(this.basePath, 'src', 'Generators', 'Transformations', 'another.py')} ${imagePathRelative} ${transformIndex} ${A} ${B} ${C} ${D}`
      
        console.log(`running: ${command}`);
      
        //Tries to run the command

        try {
            //Executes the Python script and checks if it's output
            const { stdout } = await execAsync(command);

            console.log('Python stdout:', stdout);


            return stdout.trim(); // retorna apenas o texto da saída
        } catch (error) {
          console.error('Erro ao executar script Python:', error);
          throw new Error('Erro ao processar transformação na imagem.');
        }
    }
    async handleRemoveBg(imagePathRelative: string){
        //transforms the file Path (unescessary in a supabase online Context)
        //const filePath = join(this.basePath, imagePathRelative);

        //Turns exec into an async promise
        const execAsync = promisify(exec)
        
        //The command to be executed
        const command = `python3 ${join(this.basePath, 'src', 'Generators', 'Especial', 'bgremove.py')} ${imagePathRelative}`;
        
        console.log(`running: ${command}`);
      
        //Tries to run the command

        try {
            //Executes the Python script and checks if it's output
            const { stdout } = await execAsync(command);

            console.log('Python stdout:', stdout);


            return stdout.trim(); // retorna apenas o texto da saída
        } catch (error) {
          console.error('Erro ao executar script Python:', error);
          throw new Error('Erro ao processar efeito na imagem.');
        }
    }

    async findFavorite(userId:string){
        const doesTheUserExists = await this.prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        
        if(!doesTheUserExists){
            throw new EntityNotFoundError("User",userId)
        }

        return await this.prisma.image_processing.findMany({
            where:{
                id:userId,
                completed:true
            }

        })
    }

}

