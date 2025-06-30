import { OpenAPIObject } from "@nestjs/swagger";
import { number } from "zod";

export const swaggerOptions:OpenAPIObject = {
    info:{
        title:"Image Forge",
        version:"2.5.0",
        description:"Uma API completa para operações com Imagens",
        contact:{email:"cibatechcorp@gmail.com"},
        license:{
            name:"MIT"
        },
    },
    tags:[
      {name:"Images",description:"Rotas para gerenciar o upload de imagens para um usuário"},
      {name:"Processing",description:"Rotas utilizadas para processar imagens, aplicando efeitos e transformações para ela"},
      {name:"Auth",description:"Rotas utilizadas para validação de usuários"},
      {name:"User",description:"Rotas utilizadas para gerenciamento de usuários"},
      {name:"File",description:"Rotas utilizadas para gerenciamento interno de imagens"}
    ],
    openapi:"3.0.0",
    paths:{
      '/user': {
        get: {
          tags:["User"],
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
          tags:["User"],
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
          tags:["User"],
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
        tags:["User"],
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
                      simplified:{
                        type:'array',
                        items:{$ref:"#/components/schemas/simplified_image"}
                      }
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
      "/auth": {
      "get": {
        "tags": ["Auth"],
        "summary": "Enviar código de recuperação por e-mail",
        "description": "Envia um e-mail com um código de recuperação de senha para o endereço fornecido.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": {
                    "type": "string",
                    "format": "email",
                    "description": "Endereço de e-mail do usuário"
                  }
                },
                "required": ["email"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "E-mail enviado com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "DescriptioN": {
                      "type": "string",
                      "example": "Successfully sent email"
                    },
                    "codeString": {
                      "type": "string",
                      "description": "Código de verificação enviado por e-mail"
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Erro ao enviar o e-mail",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "Description": {
                      "type": "string",
                      "example": "Email error"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": ["Auth"],
        "summary": "Atualizar senha do usuário",
        "description": "Atualiza a senha do usuário com base em um código de recuperação válido.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "passport": {
                    "type": "string",
                    "description": "Identificador do usuário"
                  },
                  "refString": {
                    "type": "string",
                    "description": "Código de recuperação enviado por e-mail"
                  },
                  "newPassword": {
                    "type": "string",
                    "description": "Nova senha"
                  }
                },
                "required": ["passport", "refString", "newPassword"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Senha atualizada com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "DescriptioN": {
                      "type": "string",
                      "example": "Successfully sent email"
                    },
                    "userUpdated": {
                      "type": "string",
                      "description": "E-mail do usuário atualizado"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Usuário não encontrado ou código inválido",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "Description": {
                      "type": "string",
                      "enum": ["User not found", "Provided code was wrong"]
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Erro interno ao atualizar senha",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "Description": {
                      "type": "string",
                      "example": "Email error"
                    }
                  }
                }
              }
            }
          }
        }
      }
      },
      "/file": {
      "get": {
        "tags":["File"],
        "summary": "Carregar imagem",
        "description": "Carrega uma imagem em base64 a partir do `image_id` fornecido no corpo da requisição.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LoadFileRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Imagem carregada com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoadFileResponse"
                }
              }
            }
          },
          "404": {
            "description": "Imagem não encontrada"
          },
          "500": {
            "description": "Erro interno ao carregar a imagem"
          }
        }
      }
      },
      "/file/{path}": {
      "delete": {
        "tags":["File"],
        "summary": "Deletar arquivo",
        "description": "Deleta o arquivo com o caminho informado.",
        "parameters": [
          {
            "name": "path",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "Caminho do arquivo"
          }
        ],
        "responses": {
          "200": {
            "description": "Arquivo deletado com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DeleteFileResponse"
                }
              }
            }
          },
          "404": {
            "description": "Arquivo não encontrado"
          }
        }
      }
      },
      "/file/rename": {
      "patch": {
        "tags":["File"],
        "summary": "Renomear arquivo",
        "description": "Renomeia um arquivo com base no `imageId` e novo nome fornecido.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RenameFileRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Arquivo renomeado com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RenameFileResponse"
                }
              }
            }
          },
          "400": {
            "description": "Parâmetros obrigatórios ausentes"
          },
          "500": {
            "description": "Erro ao renomear o arquivo"
          }
        }
      }
      },
      "processes/defined/grayscale": {
      "post": {
        "tags": ["Processamento de Imagem"],
        "summary": "Aplica efeito Grayscale",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "image_id": {
                    "type": "string",
                    "format": "uuid"
                  }
                },
                "required": ["image_id"]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Processamento do tipo Grayscale criado com sucesso"
          },
          "404": {
            "description": "Imagem não encontrada"
          },
          "500": {
            "description": "Erro desconhecido"
          }
        }
      }
      },
      "processes/defined/blur": {
      "post": {
        "tags": ["Processamento de Imagem"],
        "summary": "Aplica efeito Blur",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "image_id": {
                    "type": "string",
                    "format": "uuid"
                  },
                  "Amount": {
                    "type": "number",
                    "minimum": 1,
                    "maximum": 7
                  }
                },
                "required": ["image_id", "Amount"]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Processamento do tipo Blur criado com sucesso"
          },
          "404": {
            "description": "Imagem não encontrada"
          },
          "500": {
            "description": "Erro desconhecido"
          }
        }
      }
      },
      "processes/defined/canny": {
      "post": {
        "tags": ["Processamento de Imagem"],
        "summary": "Aplica efeito Canny",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "image_id": {
                    "type": "string",
                    "format": "uuid"
                  },
                  "Amount": {
                    "type": "number",
                    "minimum": 1,
                    "maximum": 7
                  }
                },
                "required": ["image_id", "Amount"]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Processamento do tipo Canny criado com sucesso"
          },
          "404": {
            "description": "Imagem não encontrada"
          },
          "500": {
            "description": "Erro desconhecido"
          }
        }
      }
      },
      "processes/defined/pixelate": {
      "post": {
        "tags": ["Processamento de Imagem"],
        "summary": "Aplica efeito Pixelate",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "image_id": {
                    "type": "string",
                    "format": "uuid"
                  }
                },
                "required": ["image_id"]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Processamento do tipo Pixelate criado com sucesso"
          },
          "404": {
            "description": "Imagem não encontrada"
          },
          "500": {
            "description": "Erro desconhecido"
          }
        }
      }
      },
      "processes/defined/rgb_Boost": {
      "post": {
        "tags": ["Processamento de Imagem"],
        "summary": "Aplica efeito RGB Boost",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "image_id": {
                    "type": "string",
                    "format": "uuid"
                  },
                  "Amount": {
                  "type": "object",
                  "description": "Valores para ajuste dos canais RGB",
                  "properties": {
                    "amountB": {
                      "type": "number",
                      "description": "Valor de incremento para o canal Blue"
                    },
                    "amountG": {
                      "type": "number",
                      "description": "Valor de incremento para o canal Green"
                    },
                    "amountR": {
                      "type": "number",
                      "description": "Valor de incremento para o canal Red"
                    }
                  },
                  "required": ["amountB", "amountG", "amountR"]
                  }
                },
                "required": ["image_id"]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Processamento do tipo RGB Boost criado com sucesso"
          },
          "404": {
            "description": "Imagem não encontrada"
          },
          "500": {
            "description": "Erro desconhecido"
          }
        }
      }
      },
      "processes/defined/negative": {
      "post": {
      "summary": "Aplica o efeito negativo na imagem",
      "description": "Processa a imagem com o efeito Negative, faz upload do resultado para o Supabase e retorna a imagem em base64.",
      "tags": ["Processamento de Imagem"],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "image_id": {
                  "type": "string",
                  "format": "uuid"
                }
              },
              "required": ["image_id"]
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Processamento do tipo Negative criado com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "statusCode": { "type": "integer" },
                  "description": { "type": "string" },
                  "process": { "$ref": "#/components/schemas/Process" },
                  "image": { "type": "string" }
                }
              }
            }
          }
        },
        "404": {
          "description": "Imagem não encontrada"
        },
        "500": {
          "description": "Erro desconhecido"
        }
      }
    }
      },
      "processes/defined/skin_Whitening": {
      "post": {
      "summary": "Aplica o efeito de clareamento da pele",
      "description": "Processa a imagem com o efeito Skin_Whitening, faz upload do resultado para o Supabase e retorna a imagem em base64.",
      "tags": ["Processamento de Imagem"],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "image_id": {
                  "type": "string",
                  "format": "uuid"
                }
              },
              "required": ["image_id"]
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Processamento do tipo Skin_Whitening criado com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "statusCode": { "type": "integer" },
                  "description": { "type": "string" },
                  "process": { "$ref": "#/components/schemas/Process" },
                  "image": { "type": "string" }
                }
              }
            }
          }
        },
        "404": {
          "description": "Imagem não encontrada"
        },
        "500": {
          "description": "Erro desconhecido"
        }
      }
    }
      },
      "processes/defined/change_brightness": {
      "post": {
      "summary": "Aplica o efeito de clareamento da imagem",
      "description": "Processa a imagem com o efeito change_brightness, faz upload do resultado para o Supabase e retorna a imagem em base64.",
      "tags": ["Processamento de Imagem"],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "image_id": {
                  "type": "string",
                  "format": "uuid"
                },
                "Amount":{
                  "type":"number",
                  "minimum":1,
                  "maximum":200
                }
              },
              "required": ["image_id"]
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Processamento do tipo change_brightness criado com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "statusCode": { "type": "integer" },
                  "description": { "type": "string" },
                  "process": { "$ref": "#/components/schemas/Process" },
                  "image": { "type": "string" }
                }
              }
            }
          }
        },
        "404": {
          "description": "Imagem não encontrada"
        },
        "500": {
          "description": "Erro desconhecido"
        }
      }
    }
      },
      "processes/defined/heat": {
      "post": {
      "summary": "Aplica o efeito de aquecimento na imagem",
      "description": "Processa a imagem com o efeito Heat, faz upload do resultado para o Supabase e retorna a imagem em base64.",
      "tags": ["Processamento de Imagem"],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "image_id": {
                  "type": "string",
                  "format": "uuid"
                }
              },
              "required": ["image_id"]
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Processamento do tipo Heat criado com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "statusCode": { "type": "integer" },
                  "description": { "type": "string" },
                  "process": { "$ref": "#/components/schemas/Process" },
                  "image": { "type": "string" }
                }
              }
            }
          }
        },
        "404": {
          "description": "Imagem não encontrada"
        },
        "500": {
          "description": "Erro desconhecido"
        }
      }
    }
      },
      "processes/defined/bg_remove": {
    "post": {
      "summary": "Remove o fundo da imagem",
      "description": "Processa a imagem removendo seu fundo, faz upload do resultado para o Supabase e retorna a imagem em base64.",
      "tags": ["Processamento de Imagem"],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "image_id": {
                  "type": "string",
                  "format": "uuid"
                }
              },
              "required": ["image_id"]
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Processamento do tipo RemoveBackground criado com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "statusCode": { "type": "integer" },
                  "description": { "type": "string" },
                  "process": { "$ref": "#/components/schemas/Process" },
                  "image": { "type": "string" }
                }
              }
            }
          }
        },
        "404": {
          "description": "Imagem não encontrada"
        },
        "500": {
          "description": "Erro desconhecido"
        }
      }
    }
      },
      'processes/defined/reescale': {
        post: {
          summary: 'Reescala a imagem',
          description: 'Aplica uma transformação de escala uniforme à imagem.',
          "tags": ["Processamento de Imagem"],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    image_id: { type: 'string', format: 'uuid' },
                    scale: { type: 'number' },
                  },
                  required: ['image_id', 'scale'],
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Imagem reescalada com sucesso',
            },
            404: {
              description: 'Imagem não encontrada',
            },
            500: {
              description: 'Erro interno do servidor',
            },
          },
        },
      },
      'processes/defined/translate': {
        post: {
          summary: 'Translada a imagem',
          description: 'Aplica translação (deslocamento) horizontal e vertical à imagem.',
          "tags": ["Processamento de Imagem"],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    image_id: { type: 'string', format: 'uuid' },
                    x: { type: 'number' },
                    y: { type: 'number' },
                  },
                  required: ['image_id', 'x', 'y'],
                },
              },
            },
          },
          responses: {
            201: { description: 'Imagem transladada com sucesso' },
            404: { description: 'Imagem não encontrada' },
            500: { description: 'Erro interno do servidor' },
          },
        },
      },
      'processes/defined/rotate': {
        post: {
          summary: 'Rotaciona a imagem',
          description: 'Rotaciona a imagem em um ângulo especificado em graus.',
          "tags": ["Processamento de Imagem"],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    image_id: { type: 'string', format: 'uuid' },
                    angle: { type: 'number' },
                  },
                  required: ['image_id', 'angle'],
                },
              },
            },
          },
          responses: {
            201: { description: 'Imagem rotacionada com sucesso' },
            404: { description: 'Imagem não encontrada' },
            500: { description: 'Erro interno do servidor' },
          },
        },
      },
      'processes/defined/cardinal_scale': {
        post: {
          summary: 'Aplica escala cardinal à imagem',
          description: 'Aplica escalonamento independente nos eixos X e Y.',
          "tags": ["Processamento de Imagem"],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    image_id: { type: 'string', format: 'uuid' },
                    sx: { type: 'number' },
                    sy: { type: 'number' },
                  },
                  required: ['image_id', 'sx', 'sy'],
                },
              },
            },
          },
          responses: {
            201: { description: 'Escala cardinal aplicada com sucesso' },
            404: { description: 'Imagem não encontrada' },
            500: { description: 'Erro interno do servidor' },
          },
        },
      },
      'processes/defined/crop': {
        post: {
          summary: 'Recorta a imagem',
          description: 'Recorta uma região da imagem com base nas coordenadas e tamanho.',
          "tags": ["Processamento de Imagem"],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    image_id: { type: 'string', format: 'uuid' },
                    x: { type: 'number' },
                    y: { type: 'number' },
                    w: { type: 'number' },
                    h: { type: 'number' },
                  },
                  required: ['image_id', 'x', 'y', 'w', 'h'],
                },
              },
            },
          },
          responses: {
            201: { description: 'Imagem recortada com sucesso' },
            404: { description: 'Imagem não encontrada' },
            500: { description: 'Erro interno do servidor' },
          },
        },
      },
      "processes/defined/flip": {
      "post": {
        "summary": "Espelha horizontalmente a imagem",
        "description": "Aplica um espelhamento horizontal à imagem (flip horizontal).",
        "tags": ["Processamento de Imagem"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "image_id": { "type": "string", "format": "uuid" }
                },
                "required": ["image_id"]
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Imagem espelhada com sucesso" },
          "404": { "description": "Imagem não encontrada" },
          "500": { "description": "Erro interno do servidor" }
        }
      }
      },
      "processes/defined/pencil_sketch_filter": {
    "post": {
      "summary": "Aplica o efeito lápis de esboço",
      "description": "Processa a imagem com o efeito Pencil Sketch, faz upload do resultado para o Supabase e retorna a imagem em base64.",
      "tags": ["Processamento de Imagem"],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "image_id": {
                  "type": "string",
                  "format": "uuid"
                }
              },
              "required": ["image_id"]
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Processamento do tipo pencilSketch criado com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "statusCode": { "type": "integer" },
                  "description": { "type": "string" },
                  "process": { "$ref": "#/components/schemas/Process" },
                  "image": { "type": "string" }
                }
              }
            }
          }
        },
        "404": {
          "description": "Imagem não encontrada"
        },
        "500": {
          "description": "Erro desconhecido"
        }
      }
    }
      },
      "processes/defined/cartoon_filter": {
      "post": {
      "summary": "Aplica o efeito cartoon",
      "description": "Processa a imagem com o efeito Cartoon, faz upload do resultado para o Supabase e retorna a imagem em base64.",
      "tags": ["Processamento de Imagem"],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "image_id": {
                  "type": "string",
                  "format": "uuid"
                }
              },
              "required": ["image_id"]
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Processamento do tipo cartoon criado com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "statusCode": { "type": "integer" },
                  "description": { "type": "string" },
                  "process": { "$ref": "#/components/schemas/Process" },
                  "image": { "type": "string" }
                }
              }
            }
          }
        },
        "404": {
          "description": "Imagem não encontrada"
        },
        "500": {
          "description": "Erro desconhecido"
        }
      }
    }
      },
      "processes/defined/sepia_filter": {
    "post": {
      "summary": "Aplica o efeito sépia",
      "description": "Processa a imagem com o efeito Sepia, faz upload do resultado para o Supabase e retorna a imagem em base64.",
      "tags": ["Processamento de Imagem"],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "image_id": {
                  "type": "string",
                  "format": "uuid"
                }
              },
              "required": ["image_id"]
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Processamento do tipo Sépia criado com sucesso",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "statusCode": { "type": "integer" },
                  "description": { "type": "string" },
                  "process": { "$ref": "#/components/schemas/Process" },
                  "image": { "type": "string" }
                }
              }
            }
          }
        },
        "404": {
          "description": "Imagem não encontrada"
        },
        "500": {
          "description": "Erro desconhecido"
        }
      }
    }
      },
      'processes/favorite': {
      get: {
        tags: ['Processing'],
        summary: 'Listar processos favoritos',
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: 'Lista de processos favoritos retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    statusCode: { type: 'integer', example: 200 },
                    description: {
                      type: 'string',
                      example: 'Lista de processos favoritos retornada com sucesso',
                    },
                    images: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', example: 'img_1a2b3c' },
                          userId: { type: 'string', example: 'user_123' },
                          imageUrl: {
                            type: 'string',
                            format: 'uri',
                            example: 'https://example.com/images/image1.jpg',
                          },
                          effect: { type: 'string', example: 'clarendon' },
                          createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-06-10T14:00:00.000Z',
                          },
                          isFavorite: { type: 'boolean', example: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Usuário não encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    description: { type: 'string', example: 'Usuário não encontrado' },
                    error: { type: 'string', example: 'No user found with ID: user_123' },
                  },
                },
              },
            },
          },
          500: {
            description: 'Erro desconhecido',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    description: { type: 'string', example: 'Erro desconhecido' },
                    error: {
                      type: 'string',
                      example: "Cannot read properties of undefined (reading 'id')",
                    },
                  },
                },
              },
            },
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
        simplified_image:{
          type:"object",
          properties:{
            public_url: {
              type:"string",
              description:"The public url of the image, global use for both uploaded and processed"
            },
            date: {
              type:"DateTime"
            },
            favorite: {
              type:"boolean",
              example:false
            },
            id:{
              type:"string",
              description:"The id"
            },
            type: {
              type:'enum',
              enum:["uploaded","processed"],
              example:"uploaded",
              description:"1 means processed and 0 means uploaded, processed images are the ones that you processed while uploaded are refered as images "
            },
            filename:{
              type:"string",
              example:"arquivo.png",
              description:"O nome padrão do arquivo ou do processo"
            }
          }
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
            favorite: {
              type: 'boolean',
              description: 'Se é favorita ou não',
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
              type: 'Buffer',
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
        "LoadFileRequest": {
          "type": "object",
          "properties": {
            "image_id": {
              "type": "string",
              "format": "uuid"
            }
          },
          "required": ["image_id"]
        },
        "LoadFileResponse": {
          "type": "object",
          "properties": {
            "Description": {
              "type": "string",
              "example": "Imagem Carregada com sucesso"
            },
            "image": {
              "type": "string",
              "description": "Imagem em formato base64"
            }
          }
        },
        "DeleteFileResponse": {
          "type": "object",
          "properties": {
            "statusCode": {
              "type": "integer",
              "example": 200
            },
            "message": {
              "type": "string",
              "example": "Arquivo deletado com sucesso"
            }
          }
        },
        "RenameFileRequest": {
          "type": "object",
          "properties": {
            "imageId": {
              "type": "string",
              "format": "uuid"
            },
            "newFileName": {
              "type": "string",
              "example": "nova_imagem.png"
            }
          },
          "required": ["imageId", "newFileName"]
        },
        "RenameFileResponse": {
          "type": "object",
          "properties": {
            "statusCode": {
              "type": "integer",
              "example": 200
            },
            "message": {
              "type": "string",
              "example": "Arquivo renomeado com sucesso"
            },
            "newPath": {
              "type": "string",
              "example": "/path/to/nova_imagem.png"
            }
          }
      },
      
    }

    },
}