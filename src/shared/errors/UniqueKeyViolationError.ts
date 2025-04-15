

/**
 * Classe de erro para violações de chave primária única.
 * 
 * @extends {Error}
 */
export class UniqueKeyViolationError extends Error {
    /**
     * Cria uma instância de UniqueKeyViolationError.
     * 
     * @param {string} entity - Nome da entidade onde ocorreu a violação de chave primária.
     */
    constructor(entity: string) {

        super(`Ocorreu uma violação de chave primária na entidade ${entity}`);
        this.name = 'UniqueKeyViolationError';
    }
}