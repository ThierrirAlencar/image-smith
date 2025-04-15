

/**
 * Classe de erro para entidades não encontradas no sistema.
 * 
 * @extends {Error}
 */
export class EntityNotFoundError extends Error {
    /**
     * Cria uma instância de EntityNotFoundError.
     * 
     * @param {string} entity - Nome da entidade que não foi encontrada.
     * @param {string | number} id - Identificador da entidade buscada.
     */
    constructor(entity: string, id: string | number) {
        super(`A entidade "${entity}" com ID "${id}" não foi encontrada.`);
        this.name = 'EntityNotFoundError';
    }
}
