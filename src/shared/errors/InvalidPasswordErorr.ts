


export class InvalidPasswordError extends Error {
    constructor(Email: string) {
       
        super(`Senha errada para o Email ${Email}`);
    }
}
