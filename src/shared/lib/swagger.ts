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
      '/auth': {
        get: {
          summary: 'Obter perfil do usuário',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Perfil encontrado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'integer' },
                      description: { type: 'string' },
                      user: { type: 'object' },
                    },
                  },
                },
              },
            },
            '404': { description: 'Usuário não encontrado' },
            '500': { description: 'Erro desconhecido' },
          },
        },
        put: {
          summary: 'Atualizar dados do usuário',
          security: [{ bearerAuth: [] }],
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
            '200': {
              description: 'Usuário atualizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'integer' },
                      description: { type: 'string' },
                      user: { type: 'object' },
                    },
                  },
                },
              },
            },
            '404': { description: 'Usuário não encontrado' },
            '500': { description: 'Erro desconhecido' },
          },
        },
        delete: {
          summary: 'Deletar usuário',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Usuário deletado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'integer' },
                      description: { type: 'string' },
                    },
                  },
                },
              },
            },
            '404': { description: 'Usuário não encontrado' },
            '500': { description: 'Erro desconhecido' },
          },
        },
      post: {
        summary: 'Criar novo usuário',
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
          '201': {
            description: 'Usuário criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    statusCode: { type: 'integer' },
                    description: { type: 'string' },
                    User: { type: 'string' },
                  },
                },
              },
            },
          },
          '409': {
            description: 'Chave única já está em uso (Email)',
          },
          '500': {
            description: 'Erro desconhecido',
          },
        },
      },
      },
      '/auth/login': {
        post: {
          summary: 'Login de usuário',
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
            '200': {
              description: 'Login realizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'integer' },
                      description: { type: 'string' },
                      userId: { type: 'string', format: 'uuid' },
                    },
                  },
                },
              },
            },
            '404': {
              description: 'Email não encontrado',
            },
            '500': {
              description: 'Erro desconhecido',
            },
          },
        },
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      }
    },
}