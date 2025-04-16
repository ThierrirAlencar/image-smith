import { OpenAPIObject } from "@nestjs/swagger";

export const swaggerOptions:OpenAPIObject = {
    info:{
        title:"Image Forge",
        version:"1.0.0",
        description:"Uma API completa para operações com Imagens",
        contact:{email:"cibatechcorp@gmail.com"},
        license:{
            name:"MIT"
        },
    },
    openapi:"3.0.0",
    paths:{
        '/users': {
            post: {
              tags: ['Users'],
              summary: 'Criar usuário',
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        Email: { type: 'string', format: 'email' },
                        Password: { type: 'string', minLength: 6 },
                        userName: { type: 'string' },
                      },
                      required: ['Email', 'Password', 'userName'],
                    },
                  },
                },
              },
              responses: {
                201: {
                  description: 'Usuário criado com sucesso',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          statusCode: { type: 'integer' },
                          description: { type: 'string' },
                          user: { type: 'string' },
                        },
                      },
                    },
                  },
                },
                409: {
                  description: 'Email já está em uso',
                },
              },
            },
          },
        '/users/login': {
            post: {
              tags: ['Users'],
              summary: 'Login do usuário',
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        Email: { type: 'string', format: 'email' },
                        Password: { type: 'string' },
                      },
                      required: ['Email', 'Password'],
                    },
                  },
                },
              },
              responses: {
                200: {
                  description: 'Login realizado com sucesso',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          statusCode: { type: 'integer' },
                          description: { type: 'string' },
                          userId: { type: 'string' },
                        },
                      },
                    },
                  },
                },
                404: {
                  description: 'Usuário não encontrado',
                },
              },
            },
          },
        '/users/{id}': {
            get: {
              tags: ['Users'],
              summary: 'Obter perfil do usuário',
              parameters: [
                {
                  name: 'id',
                  in: 'path',
                  required: true,
                  schema: { type: 'string' },
                },
              ],
              responses: {
                200: {
                  description: 'Perfil encontrado com sucesso',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          statusCode: { type: 'integer' },
                          description: { type: 'string' },
                          user: {
                            type: 'object',
                            properties: {
                              email: { type: 'string' },
                              name: { type: 'string' },
                              role: { type: 'string', enum: ['User', 'Admin'] },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                404: {
                  description: 'Usuário não encontrado',
                },
              },
            },
            patch: {
              tags: ['Users'],
              summary: 'Atualizar usuário',
              parameters: [
                {
                  name: 'id',
                  in: 'path',
                  required: true,
                  schema: { type: 'string' },
                },
              ],
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        email: { type: 'string', format: 'email' },
                        name: { type: 'string' },
                        password: { type: 'string', minLength: 6 },
                        role: { type: 'string', enum: ['User', 'Admin'] },
                      },
                    },
                  },
                },
              },
              responses: {
                200: {
                  description: 'Usuário atualizado com sucesso',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          statusCode: { type: 'integer' },
                          description: { type: 'string' },
                          user: {
                            type: 'object',
                            properties: {
                              email: { type: 'string' },
                              name: { type: 'string' },
                              role: { type: 'string' },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                404: {
                  description: 'Usuário não encontrado',
                },
              },
            },
            delete: {
              tags: ['Users'],
              summary: 'Deletar usuário',
              parameters: [
                {
                  name: 'id',
                  in: 'path',
                  required: true,
                  schema: { type: 'string' },
                },
              ],
              responses: {
                200: {
                  description: 'Usuário deletado com sucesso',
                },
                404: {
                  description: 'Usuário não encontrado',
                },
              },
            },
          }
    }
}