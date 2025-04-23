import { Injectable } from '@nestjs/common';
import { Image, image_processing, Prisma } from '@prisma/client';
import { join } from 'path';
import { EntityNotFoundError } from 'src/shared/errors/EntityDoesNotExistsError';
import { PrismaService } from 'src/shared/prisma/PrismaService';
import { promises as fs } from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
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
        var AllProcesses:image_processing[]

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

                AllProcesses.concat(loadList)
            }
        ))
        
        //Retorna a lista de Processos baseados no último processo realizado
        return AllProcesses.sort((a, b) => b.created_at.getTime() - a.created_at.getTime()).slice(0, 1)

    }

    async handleProcessEffect(imagePathRelative: string, effectIndex: number): Promise<string> {
        const filePath = join(this.basePath, imagePathRelative);
        const execAsync = promisify(exec)
        const command = `python3 ${join(this.basePath, 'src', 'Generators', 'Effects', 'Effects.py')} ${filePath} ${effectIndex} 5 5 5`;
        console.log(`running: ${command}`);
      
        try {
          const { stdout } = await execAsync(command);
          console.log('Python stdout:', stdout);
          return stdout.trim(); // retorna apenas o texto da saída
        } catch (error) {
          console.error('Erro ao executar script Python:', error);
          throw new Error('Erro ao processar efeito na imagem.');
        }
      }

}

