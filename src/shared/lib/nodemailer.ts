
import { createTransport } from "nodemailer";
import { EmailType } from "src/interfaces/emailType";


//configuração de conexao com o nodemailer
const config = {
    host: "smtp.gmail.com", // Padrão para Gmail, mas pode ser alterado
    port:587, // Conversão para número e padrão 587 (STARTTLS)
    auth: {
        user: process.env.ADMIN_EMAIL, // Usuário do e-mail
        pass: process.env.ADMIN_PASSWORD  // Senha ou Senha de App
    },
    secure:465 // SSL para porta 465, STARTTLS para outras
};

// setup nodemailer instance
const transport = createTransport({
    host:config.host,
    port:config.port,
    secure:false, //define que nao havera segurança
    auth:config.auth, 
    tls:{
        rejectUnauthorized:false //define que nao será recusado em redes nao autorizadas
    }
});

/**
 * Envia um e-mail utilizando as configurações do transporte de e-mail.
 *
 * @param email - Objeto contendo as informações do e-mail a ser enviado.
 * @param email.subject - O assunto do e-mail.
 * @param email.text - O conteúdo do e-mail no formato de texto simples.
 * @param email.to - O endereço de e-mail do destinatário.
 * 
 * @returns Uma promessa que resolve para o resultado do envio do e-mail.
 *          O resultado contém informações sobre o e-mail enviado, como identificador e status.
 *
 * @throws Pode lançar erros relacionados ao envio de e-mails, incluindo problemas de configuração
 *         do transporte ou dados inválidos.
 *
 * @example
 * ```typescript
 * const email: EmailType = {
 *   subject: "Bem-vindo ao nosso serviço!",
 *   text: "Estamos felizes em ter você conosco.",
 *   to: "usuario@exemplo.com",
 * };
 *
 * SendEmail(email)
 *   .then(response => console.log("E-mail enviado com sucesso:", response))
 *   .catch(error => console.error("Erro ao enviar o e-mail:", error));
 * ```
 */
export async function SendEmail(email:EmailType) {
    const {subject,text,to} = email
    const emailSent = await transport.sendMail({
        text,
        subject,
        to,
        from:process.env.ADMIN_EMAIL
    })
    return emailSent
}