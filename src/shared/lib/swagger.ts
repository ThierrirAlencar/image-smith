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
    tags:[
      {name:"Images",description:"Rotas para gerenciar o upload de imagens para um usuário"},
      {name:"Processing",description:"Rotas utilizadas para processar imagens, aplicando efeitos e transformações para ela"},
      {name:"Auth",description:"Rotas utilizadas para validação, registro e gerenciamento dos usuários"},
    ],
    openapi:"3.0.0",
    paths:{
      '/user': {
        get: {
          tags:["Auth"],
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
          tags:["Auth"],
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
          tags:["Auth"],
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
        tags:["Auth"],
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
      '/user/login': {
        post: {
          tags:["Auth"],
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
      put: {
        tags: ['Images'],
        summary: 'Atualizar imagem (favoritar/desfavoritar)',
        description: 'Atualiza as informações de uma imagem, como marcar ou desmarcar como favorita',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateImageDto',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Imagem atualizada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    statusCode: { type: 'integer', example: 201 },
                    description: { type: 'string', example: 'Imagem atualizada com sucesso' },
                    image: { type: 'object' }, // Aqui também pode ser detalhado conforme o modelo de imagem
                  },
                },
              },
            },
          },
          '500': {
            description: 'Erro ao salvar imagem',
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
      },
      '/processes': {
        post: {
          tags: ['Processing'],
          summary: 'Aplica efeitos em uma imagem',
          description: 'Recebe uma imagem identificada por `image_id` e aplica um efeito visual, retornando a imagem em base64.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProcessRequest',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Processamento criado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ProcessResponse',
                  },
                },
              },
            },
            '404': {
              description: 'Imagem não encontrada',
            },
            '500': {
              description: 'Erro interno no servidor',
            },
          },
        },
      },
      '/processes/{id}': {
        summary:"Utilize para CRUD de um processo específico",
        put: {
          tags:["Processing"],
          summary: 'Atualizar um processamento de imagem',
          description: 'Atualiza dados como operação e status de conclusão de um processamento.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid',
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UpdateImageProcessDto',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Processamento atualizado com sucesso',
            },
            '500': {
              description: 'Erro ao atualizar processamento',
            },
          },
        },
        delete: {
          tags:["Processing"],
          summary: 'Deletar um processamento de imagem',
          description: 'Remove um processamento com base no ID.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Processamento deletado com sucesso',
            },
            '404': {
              description: 'Processamento não encontrado',
            },
            '500': {
              description: 'Erro ao deletar processamento',
            },
          },
        },
        get: {
          tags:["Processing"],
          summary: 'Buscar um processamento por ID',
          description: 'Retorna detalhes de um processamento específico.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Processamento retornado com sucesso',
            },
            '404': {
              description: 'Processamento não encontrado',
            },
            '500': {
              description: 'Erro ao buscar processamento',
            },
          },
        },
      },
      '/processes/image/{imageId}': {
        get: {
          tags:["Processing"],
          summary: 'Listar processamentos de uma imagem',
          description: 'Retorna todos os processamentos de uma imagem específica pelo ID.',
          parameters: [
            {
              name: 'imageId',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Lista de processamentos retornada com sucesso',
            },
            '404': {
              description: 'Imagem não encontrada',
            },
            '500': {
              description: 'Erro ao buscar processamentos',
            },
          },
        },
      },
      '/processes/recent': {
        get: {
          tags:["Processing"],
          summary: 'Buscar o processamento mais recente do usuário',
          description: 'Retorna o último processamento realizado entre todas as imagens do usuário logado.',
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            '200': {
              description: 'Último processamento retornado com sucesso',
            },
            '404': {
              description: 'Usuário não encontrado',
            },
            '500': {
              description: 'Erro desconhecido',
            },
          },
        },
      },
      'images/favorite': {
        get: {
          tags: ['Images'],
          summary: 'Listar imagens favoritas do usuário autenticado',
          description: 'Retorna todas as imagens associadas ao usuário autenticado',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Lista de imagens retornada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      statusCode: { type: 'integer', example: 200 },
                      description: { type: 'string', example: 'Lista de imagens retornada com sucesso' },
                      images: {
                        type: 'array',
                        items: { type: 'object' }, // Você pode definir melhor esse schema se quiser detalhar as propriedades da imagem
                      },
                    },
                  },
                },
              },
            },
            '404': {
              description: 'Usuário não encontrado',
            },
            '500': {
              description: 'Erro interno do servidor',
            },
          },
        },
      },
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
        CreateImageProcessDto: {
          type: 'object',
          properties: {
            image_id: {
              type: 'string',
              format: 'uuid',
            },
            output_filename: {
              type: 'string',
              nullable: true,
            },
          },
          required: ['image_id'],
        },
        EffectTypeEnum: {
          type: 'string',
          description: 'Tipo de efeito a ser aplicado na imagem',
          enum: [
            '',
            'Grayscale', 'Blur', 'Canny', 'Pixelate',
            'BGR2RGB', 'BGR2HSV', 'BGR2HLS', 'BGR2LUV',
            'RGB_Boost', 'Negative', 'Brightness', 'Skin_Whitening',
            'Heat', 'Sepia', 'Cartoon', 'Pencil_Sketch'
          ],
          default: '',
        },
        UpdateImageProcessDto: {
          type: 'object',
          properties: {
            completed: {
              type: 'boolean',
              description: 'Se foi concluído ou não',
            },
            operation: {
              type: 'string',
              description: 'Descreve a operação realizada',
            },
          },
        },
        ProcessRequest: {
          type: 'object',
          properties: {
            image_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID da imagem a ser processada',
            },
            output_filename: {
              type: 'string',
              nullable: true,
              description: 'Nome opcional do arquivo de saída',
            },
            type: {
              type: 'string',
              enum: [
                '',
                'Grayscale', 'Blur', 'Canny', 'Pixelate',
                'BGR2RGB', 'BGR2HSV', 'BGR2HLS', 'BGR2LUV',
                'RGB_Boost', 'Negative', 'Brightness', 'Skin_Whitening',
                'Heat', 'Sepia', 'Cartoon', 'Pencil_Sketch'
              ],
              default: '',
              description: 'Tipo de efeito a ser aplicado',
            },
            amount: {
              type: 'object',
              properties: {
                amountR: {
                  type: 'number',
                  description: 'Intensidade do efeito aplicado para a cor vermelha (também é usado como intensidade quando as outras cores não são necessárias)',
                },
                amountG: {
                  type: 'number',
                  default: 0,
                  description: 'Intensidade do efeito aplicado para a cor verde',
                },
                amountB: {
                  type: 'number',
                  default: 0,
                  description: 'Intensidade do efeito aplicado para a cor azul',
                },
              },
              required: ['amountR'],
            },
          },
          required: ['image_id', 'amount'],
        },
        ProcessResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'number',
              example: 201,
            },
            description: {
              type: 'string',
              example: 'Processamento criado com sucesso',
            },
            process: {
              type: 'object',
              description: 'Dados do processo de imagem criado',
            },
            image: {
              type: 'string',
              format: 'byte',
              description: 'Imagem processada codificada em base64',
            },
          },
        },  
        UpdateImageDto: {
          type: 'object',
          properties: {
            imageId: {
              type: 'string',
              format: 'uuid',
              description: 'UUID da imagem a ser atualizada',
              example: 'b2f04b5e-0b0d-4f67-aed7-b6a5f8c94e91',
            },
            user_favorite: {
              type: 'boolean',
              description: 'Marca se a imagem é favorita ou não pelo usuário',
              example: true,
              default: false,
            },
          },
          required: ['imageId', 'user_favorite'],
        },
      },
        
    },
}