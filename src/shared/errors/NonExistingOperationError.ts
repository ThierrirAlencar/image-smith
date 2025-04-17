


export class NonExistingOperationError extends Error {
    constructor(Operation: string) {
       
        super(`Erro causado ao tentar realizar uma operação nao permitida ou inexistente de um arquivo, operação: ${Operation}`);
    }
}
