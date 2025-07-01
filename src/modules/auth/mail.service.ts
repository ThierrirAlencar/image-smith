import { Injectable } from "@nestjs/common";
import { hash } from "bcryptjs";
import { retry } from "rxjs";
import { EmailType } from "src/interfaces/emailType";
import { EntityNotFoundError } from "src/shared/errors/EntityDoesNotExistsError";
import { InvalidInformationProvided } from "src/shared/errors/InvalidInformationProvided";
import { Gen5digitsValidationCode, GenValidationCode } from "src/shared/functions/genValidationCode";
import { splitStringAtDash } from "src/shared/functions/separateCookieAtDash";
import { SendEmail } from "src/shared/lib/nodemailer";
import { PrismaService } from "src/shared/prisma/PrismaService";

@Injectable()
export class mailService{
    constructor(private prisma:PrismaService){}

    async sendRecoveryEmail(userEmail:string){
        const randCode = Gen5digitsValidationCode()
        const email:EmailType = {
            subject:"no-reply email de recuperação de senha",
            text:`
                <!DOCTYPE html>
                    <html lang="pt-BR">
                    <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <title>Recuperação de Senha</title>
                    <style>
                        body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f6f8;
                        margin: 0;
                        padding: 0;
                        }
                        .container {
                        max-width: 600px;
                        margin: 30px auto;
                        background: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                        }
                        .header {
                        background-color: #007bff;
                        color: #ffffff;
                        padding: 20px;
                        text-align: center;
                        }
                        .content {
                        padding: 30px;
                        color: #333333;
                        font-size: 16px;
                        }
                        .button {
                        display: block;
                        width: fit-content;
                        margin: 30px auto;
                        padding: 12px 25px;
                        background-color: #007bff;
                        color: white;
                        text-decoration: none;
                        border-radius: 6px;
                        font-weight: bold;
                        }
                        .footer {
                        font-size: 14px;
                        color: #888888;
                        text-align: center;
                        padding: 20px;
                        }
                    </style>
                    </head>
                    <body>
                    <div class="container">
                        <div class="header">
                        <h1>Recuperação de Senha</h1>
                        </div>
                        <div class="content">
                        <p>Olá,</p>
                        <p>Recebemos uma solicitação para redefinir sua senha. Se você fez essa solicitação, digite o código abaixo</p>

                            <strong>${randCode}</strong>            

                        <p>Se você não solicitou essa alteração, pode ignorar este e-mail. Sua senha permanecerá a mesma.</p>

                        <p>Atenciosamente,<br/>Equipe ImageForge</p>
                        </div>
                        <div class="footer">
                            Este é um e-mail automático. Não responda diretamente a esta mensagem.
                        </div>
                    </div>
                    </body>
                    </html>

            `,
            to:userEmail
        }

        //enviar o email
        await SendEmail(email)
        return `${userEmail}-${randCode}`
    }

    async updateUserPasswordBasedInPassword(refString:string,passedCode:string,newPassword:string){
        const [email,code] = splitStringAtDash(refString)
        const doesTheUserExists = await this.prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!doesTheUserExists){
            throw new EntityNotFoundError("User",email)
        }
        if(code != passedCode){
            throw new InvalidInformationProvided()
        }
        
        const _password = await hash(newPassword,9)
        const response = await this.prisma.user.update({
            data:{
                password:_password
            },
            where:{
                id:doesTheUserExists.id
            }
        })

        return response
    }
}