

export class FileHandlingError extends Error {
    constructor(reason: string) {

        super(`Erro causado durante a manipulação do arquivo, motivo: ${reason}`);
    }
}
