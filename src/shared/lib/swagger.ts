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
      },
      '/images': {
      post: {
        tags: ['Images'],
        summary: 'Upload de imagem',
        description: 'Envia uma imagem associada ao usuário autenticado.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Arquivo da imagem para upload',
                  },
                },
                required: ['file'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Imagem enviada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    statusCode: { type: 'number', example: 201 },
                    description: { type: 'string', example: 'Imagem enviada com sucesso' },
                    image: { $ref: '#/components/schemas/Image' },
                  },
                },
              },
            },
          },
          500: {
            description: 'Erro ao salvar imagem',
          },
        },
      },
      get: {
        tags: ['Images'],
        summary: 'Listar imagens do usuário',
        description: 'Retorna todas as imagens associadas ao usuário autenticado.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de imagens retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    statusCode: { type: 'number', example: 200 },
                    description: { type: 'string', example: 'Lista de imagens retornada com sucesso' },
                    images: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Image' },
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
        tags: ['Images'],
        summary: 'Deletar imagem do usuário',
        description: 'Remove a imagem associada ao ID do usuário autenticado.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Imagem deletada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    statusCode: { type: 'number', example: 200 },
                    description: { type: 'string', example: 'Imagem deletada com sucesso' },
                    image: { $ref: '#/components/schemas/Image' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Imagem não encontrada',
          },
        },
      },
      },
      '/images/{id}': {
        get: {
          tags: ['Images'],
          summary: 'Obter imagem por ID',
          description: 'Retorna uma imagem com base no ID fornecido.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
            },
          ],
          responses: {
            200: {
              description: 'Imagem retornada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'number', example: 200 },
                      description: { type: 'string', example: 'Imagem retornada com sucesso' },
                      image: { $ref: '#/components/schemas/Image' },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Imagem não encontrada',
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
      },
      schemas: {
        Image: {
          type: 'object',
          properties: {
            Id: { type: 'string', format: 'uuid', example: '2c228be3-5e7f-4d19-85d0-5f0a7e524d56' },
            original_filename: { type: 'string', example: 'foto1.jpg' },
            stored_filepath: { type: 'string', example: '/uploads/foto1.jpg' },
            process_filepath: { type: 'string', nullable: true, example: '/processed/foto1_processed.jpg' },
            size: { type: 'number', example: 204800 },
            created_at: { type: 'string', format: 'date-time', example: '2025-04-16T12:00:00Z' },
            updated_at: { type: 'string', format: 'date-time', example: '2025-04-16T12:00:00Z' },
          },
        },
        },
    },
}