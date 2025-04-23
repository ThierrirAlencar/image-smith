/** Interface de email utilizada para enviar emails
 * @argument text - Corpo do email(texto principal a ser enviado)
 * @argument subject - Cabeçalho / titulo do email
 * @argument to - Email que irá receber a mensagem (alvo do email)
*/
export interface EmailType{
    text: string
    to: string 
    subject:string
}