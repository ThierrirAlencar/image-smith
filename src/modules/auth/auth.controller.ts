import { Controller, Get, Put, Req, Res} from '@nestjs/common';
import { Response } from 'express';
import { z } from 'zod';
import { mailService } from './mail.service';
import passport from 'passport';
import { EntityNotFoundError } from 'src/shared/errors/EntityDoesNotExistsError';
import { InvalidInformationProvided } from 'src/shared/errors/InvalidInformationProvided';

@Controller('auth')
export class AuthController {
    constructor(private mailService:mailService){}
    @Get("")
    async sendCode(@Req() req:Request, @Res() res: Response){
        const {email} = z.object({
            email:z.string().email()
        }).parse(req.body)
    
        try{
            const response = await this.mailService.sendRecoveryEmail(email);

            res.status(200).send({
              DescriptioN:"Successfully sent email",
              codeString:response      
            })
        }catch(err){
            res.status(500).send({
                Description:"Email error"
            })
        }
    }

    @Put("")
    async updateUserPassword(@Req() req:Request, @Res() res: Response){
        const {newPassword,passport,refString} = z.object({
            passport:z.string(),
            refString:z.string(),
            newPassword:z.string(),
        }).parse(req.body)
    
        try{
            const response = await this.mailService.updateUserPasswordBasedInPassword(refString,passport,newPassword);

            res.status(200).send({
              DescriptioN:"Successfully sent email",
              userUpdated:response.email      
            })
        }catch(err){
            if(err instanceof EntityNotFoundError){
                res.status(404).send({
                    Description:"User not found"
                })
            }else if(err instanceof InvalidInformationProvided){
                res.status(404).send({
                    Description:"Provided code was wrong"
                })
            }else{
                res.status(500).send({
                    Description:"Email error"
                })
            }

        }
    }

}
