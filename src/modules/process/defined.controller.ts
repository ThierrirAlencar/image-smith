import { Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { z } from 'zod';
import { ImageService } from '../image/image.service';
import { UserService } from '../user/user.service';
import { ProcessService } from './process.service';
import { FileService } from '../file/file.service';
import { SupabaseService } from '../image/supabase.service';
import { EntityNotFoundError } from 'src/shared/errors/EntityDoesNotExistsError';

@Controller('defined')
export class DefinedController {
    constructor(
        private ProcessService: ProcessService,
        private ImageService:ImageService,
        private fileHandler:FileService,
        private supabaseService:SupabaseService,
        private UserService:UserService
    ){}

    //Grayscale
    @Post("grayscale")
    async grayscale(@Req() req:Request,@Res() res:Response){
        const schema = z.object({
                image_id: z.string().uuid()
        }).parse(req.body);

        const {image_id} = schema

        try{
            //Find the Image Who we Want to Change
            const {stored_filepath,original_filename,user_id} = await this.ImageService.findOne(image_id)
            //Load User name
            const {name} = await this.UserService.userProfile(user_id)

            //handle the process (calls python)
        const fileFolderResponse = await this.ProcessService.handleProcessEffect(stored_filepath,1,{amountB:0,amountG:0,amountR:0})

               // //Upload to Supabase
        //LoadImage Local Buffer (from python saved directory)
        const localFileResponse = await this.fileHandler.loadImage(fileFolderResponse)

        //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
        const publicPathUrl = await this.supabaseService.uploadToSupabase({
          buffer:localFileResponse,
          mimetype:"png",originalname:original_filename
        }, `${name}/Grayscale` )

        //Create the process as entity registering the sucess of the process operation 
        const created = await this.ProcessService.create({image_id,output_filename:publicPathUrl.public_url,operation:"Grayscale",});
        //carregar imagem para retornar como base64
        const bufferResult = await this.fileHandler.loadImage(fileFolderResponse)
          // Transforma buffers em base64 e monta data URL
        const base64 = bufferResult.toString('base64'); 

        return {
          statusCode: 201,
          description: 'Processamento do tipo Grayscale criado com sucesso',
          process: created,
          image:base64
        };
        }catch(err){
            if (err instanceof EntityNotFoundError) {
                throw new HttpException(
                {
                    description: 'Imagem não encontrada',
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
    //Blur
    @Post("blur")
    async blur(@Req() req:Request,@Res() res:Response){
        const schema = z.object({
                image_id: z.string().uuid(),
                Amount:z.number({
                    description:""
                }).max(7).min(1)
        }).parse(req.body);

        const {image_id,Amount} = schema

        try{
            //Find the Image Who we Want to Change
            const {stored_filepath,original_filename,user_id} = await this.ImageService.findOne(image_id)
            //Load User name
            const {name} = await this.UserService.userProfile(user_id)

            //handle the process (calls python)
        const fileFolderResponse = await this.ProcessService.handleProcessEffect(stored_filepath,2,{amountB:0,amountG:0,amountR:Amount})

               // //Upload to Supabase
        //LoadImage Local Buffer (from python saved directory)
        const localFileResponse = await this.fileHandler.loadImage(fileFolderResponse)

        //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
        const publicPathUrl = await this.supabaseService.uploadToSupabase({
          buffer:localFileResponse,
          mimetype:"png",originalname:original_filename
        }, `${name}/Blur` )

        //Create the process as entity registering the sucess of the process operation 
        const created = await this.ProcessService.create({image_id,output_filename:publicPathUrl.public_url,operation:"Blur",});
        //carregar imagem para retornar como base64
        const bufferResult = await this.fileHandler.loadImage(fileFolderResponse)
          // Transforma buffers em base64 e monta data URL
        const base64 = bufferResult.toString('base64'); 

        return {
          statusCode: 201,
          description: 'Processamento do tipo blur criado com sucesso',
          process: created,
          image:base64
        };
        }catch(err){
            if (err instanceof EntityNotFoundError) {
                throw new HttpException(
                {
                    description: 'Imagem não encontrada',
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
    //Canny
    @Post("canny")
    async Canny(@Req() req:Request,@Res() res:Response){
        const schema = z.object({
                image_id: z.string().uuid(),
                Amount:z.number({
                    description:""
                }).max(7).min(1)
        }).parse(req.body);

        const {image_id,Amount} = schema

        try{
            //Find the Image Who we Want to Change
            const {stored_filepath,original_filename,user_id} = await this.ImageService.findOne(image_id)
            //Load User name
            const {name} = await this.UserService.userProfile(user_id)

            //handle the process (calls python)
        const fileFolderResponse = await this.ProcessService.handleProcessEffect(stored_filepath,3,{amountB:0,amountG:0,amountR:Amount})

               // //Upload to Supabase
        //LoadImage Local Buffer (from python saved directory)
        const localFileResponse = await this.fileHandler.loadImage(fileFolderResponse)

        //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
        const publicPathUrl = await this.supabaseService.uploadToSupabase({
          buffer:localFileResponse,
          mimetype:"png",originalname:original_filename
        }, `${name}/Canny` )

        //Create the process as entity registering the sucess of the process operation 
        const created = await this.ProcessService.create({image_id,output_filename:publicPathUrl.public_url,operation:"Canny",});
        //carregar imagem para retornar como base64
        const bufferResult = await this.fileHandler.loadImage(fileFolderResponse)
          // Transforma buffers em base64 e monta data URL
        const base64 = bufferResult.toString('base64'); 

        return {
          statusCode: 201,
          description: 'Processamento do tipo Canny criado com sucesso',
          process: created,
          image:base64
        };
        }catch(err){
            if (err instanceof EntityNotFoundError) {
                throw new HttpException(
                {
                    description: 'Imagem não encontrada',
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
    //Pixelate
    @Post("pixelate")
    async Pixelate(@Req() req:Request,@Res() res:Response){
        const schema = z.object({
                image_id: z.string().uuid()
        }).parse(req.body);

        const {image_id} = schema

        try{
            //Find the Image Who we Want to Change
            const {stored_filepath,original_filename,user_id} = await this.ImageService.findOne(image_id)
            //Load User name
            const {name} = await this.UserService.userProfile(user_id)

            //handle the process (calls python)
        const fileFolderResponse = await this.ProcessService.handleProcessEffect(stored_filepath,3,{amountB:0,amountG:0,amountR:0})

               // //Upload to Supabase
        //LoadImage Local Buffer (from python saved directory)
        const localFileResponse = await this.fileHandler.loadImage(fileFolderResponse)

        //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
        const publicPathUrl = await this.supabaseService.uploadToSupabase({
          buffer:localFileResponse,
          mimetype:"png",originalname:original_filename
        }, `${name}/Pixelate` )

        //Create the process as entity registering the sucess of the process operation 
        const created = await this.ProcessService.create({image_id,output_filename:publicPathUrl.public_url,operation:"Pixelate",});
        //carregar imagem para retornar como base64
        const bufferResult = await this.fileHandler.loadImage(fileFolderResponse)
          // Transforma buffers em base64 e monta data URL
        const base64 = bufferResult.toString('base64'); 

        return {
          statusCode: 201,
          description: 'Processamento do tipo Pixelate criado com sucesso',
          process: created,
          image:base64
        };
        }catch(err){
            if (err instanceof EntityNotFoundError) {
                throw new HttpException(
                {
                    description: 'Imagem não encontrada',
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
    //RGB Boost
    @Post("rgb_Boost")
    async rgb_boost(@Req() req:Request,@Res() res:Response){
        const schema = z.object({
                image_id: z.string().uuid()
        }).parse(req.body);

        const {image_id} = schema

        try{
            //Find the Image Who we Want to Change
            const {stored_filepath,original_filename,user_id} = await this.ImageService.findOne(image_id)
            //Load User name
            const {name} = await this.UserService.userProfile(user_id)

            //handle the process (calls python)
        const fileFolderResponse = await this.ProcessService.handleProcessEffect(stored_filepath,9,{amountB:0,amountG:0,amountR:0})

               // //Upload to Supabase
        //LoadImage Local Buffer (from python saved directory)
        const localFileResponse = await this.fileHandler.loadImage(fileFolderResponse)

        //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
        const publicPathUrl = await this.supabaseService.uploadToSupabase({
          buffer:localFileResponse,
          mimetype:"png",originalname:original_filename
        }, `${name}/RGB_Boost` )

        //Create the process as entity registering the sucess of the process operation 
        const created = await this.ProcessService.create({image_id,output_filename:publicPathUrl.public_url,operation:"RGB_Boost",});
        //carregar imagem para retornar como base64
        const bufferResult = await this.fileHandler.loadImage(fileFolderResponse)
          // Transforma buffers em base64 e monta data URL
        const base64 = bufferResult.toString('base64'); 

        return {
          statusCode: 201,
          description: 'Processamento do tipo RGBBoost criado com sucesso',
          process: created,
          image:base64
        };
        }catch(err){
            if (err instanceof EntityNotFoundError) {
                throw new HttpException(
                {
                    description: 'Imagem não encontrada',
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
    //Negative
    @Post("negative")
    async negative(@Req() req:Request,@Res() res:Response){
        const schema = z.object({
                image_id: z.string().uuid()
        }).parse(req.body);

        const {image_id} = schema

        try{
            //Find the Image Who we Want to Change
            const {stored_filepath,original_filename,user_id} = await this.ImageService.findOne(image_id)
            //Load User name
            const {name} = await this.UserService.userProfile(user_id)

            //handle the process (calls python)
            const fileFolderResponse = await this.ProcessService.handleProcessEffect(stored_filepath,10,{amountB:0,amountG:0,amountR:0})

            //Upload to Supabase
            //LoadImage Local Buffer (from python saved directory)
            const localFileResponse = await this.fileHandler.loadImage(fileFolderResponse)

            //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
            const publicPathUrl = await this.supabaseService.uploadToSupabase({
            buffer:localFileResponse,
            mimetype:"png",originalname:original_filename
            }, `${name}/Negative` )

            //Create the process as entity registering the sucess of the process operation 
            const created = await this.ProcessService.create({image_id,output_filename:publicPathUrl.public_url,operation:"Negative",});
            //carregar imagem para retornar como base64
            const bufferResult = await this.fileHandler.loadImage(fileFolderResponse)
            // Transforma buffers em base64 e monta data URL
            const base64 = bufferResult.toString('base64'); 

        return {
          statusCode: 201,
          description: 'Processamento do tipo Negative criado com sucesso',
          process: created,
          image:base64
        };
        }catch(err){
            if (err instanceof EntityNotFoundError) {
                throw new HttpException(
                {
                    description: 'Imagem não encontrada',
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
    //Skin whitering
    @Post("skin_Whitening")
    async skin_Whitening(@Req() req:Request,@Res() res:Response){
        const schema = z.object({
                image_id: z.string().uuid()
        }).parse(req.body);

        const {image_id} = schema

        try{
            //Find the Image Who we Want to Change
            const {stored_filepath,original_filename,user_id} = await this.ImageService.findOne(image_id)
            //Load User name
            const {name} = await this.UserService.userProfile(user_id)

            //handle the process (calls python)
            const fileFolderResponse = await this.ProcessService.handleProcessEffect(stored_filepath,11,{amountB:0,amountG:0,amountR:0})

            //Upload to Supabase
            //LoadImage Local Buffer (from python saved directory)
            const localFileResponse = await this.fileHandler.loadImage(fileFolderResponse)

            //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
            const publicPathUrl = await this.supabaseService.uploadToSupabase({
            buffer:localFileResponse,
            mimetype:"png",originalname:original_filename
            }, `${name}/Skin_Whitening` )

            //Create the process as entity registering the sucess of the process operation 
            const created = await this.ProcessService.create({image_id,output_filename:publicPathUrl.public_url,operation:"Skin_Whitening",});
            //carregar imagem para retornar como base64
            const bufferResult = await this.fileHandler.loadImage(fileFolderResponse)
            // Transforma buffers em base64 e monta data URL
            const base64 = bufferResult.toString('base64'); 

        return {
          statusCode: 201,
          description: 'Processamento do tipo Skin_Whitening criado com sucesso',
          process: created,
          image:base64
        };
        }catch(err){
            if (err instanceof EntityNotFoundError) {
                throw new HttpException(
                {
                    description: 'Imagem não encontrada',
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
    //Heat
    @Post("heat")
    async heat(@Req() req:Request,@Res() res:Response){
        const schema = z.object({
                image_id: z.string().uuid()
        }).parse(req.body);

        const {image_id} = schema

        try{
            //Find the Image Who we Want to Change
            const {stored_filepath,original_filename,user_id} = await this.ImageService.findOne(image_id)
            //Load User name
            const {name} = await this.UserService.userProfile(user_id)

            //handle the process (calls python)
            const fileFolderResponse = await this.ProcessService.handleProcessEffect(stored_filepath,11,{amountB:0,amountG:0,amountR:0})

            //Upload to Supabase
            //LoadImage Local Buffer (from python saved directory)
            const localFileResponse = await this.fileHandler.loadImage(fileFolderResponse)

            //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
            const publicPathUrl = await this.supabaseService.uploadToSupabase({
            buffer:localFileResponse,
            mimetype:"png",originalname:original_filename
            }, `${name}/Heat` )

            //Create the process as entity registering the sucess of the process operation 
            const created = await this.ProcessService.create({image_id,output_filename:publicPathUrl.public_url,operation:"Heat",});
            //carregar imagem para retornar como base64
            const bufferResult = await this.fileHandler.loadImage(fileFolderResponse)
            // Transforma buffers em base64 e monta data URL
            const base64 = bufferResult.toString('base64'); 

        return {
          statusCode: 201,
          description: 'Processamento do tipo Heat criado com sucesso',
          process: created,
          image:base64
        };
        }catch(err){
            if (err instanceof EntityNotFoundError) {
                throw new HttpException(
                {
                    description: 'Imagem não encontrada',
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
