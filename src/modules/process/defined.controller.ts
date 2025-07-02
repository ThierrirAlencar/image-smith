import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { string, z } from "zod";
import { ImageService } from "../image/image.service";
import { UserService } from "../user/user.service";
import { ProcessService } from "./process.service";
import { FileService } from "../file/file.service";
import { SupabaseService } from "../supabase/supabase.service";
import { EntityNotFoundError } from "src/shared/errors/EntityDoesNotExistsError";
import { replicateService } from "../replicate/replicate.service";
import { randomUUID } from "crypto";
import { AuthGuard } from "@nestjs/passport";
import { AuthRequest } from "src/interfaces/authRequest";

@Controller("processes/defined")
export class DefinedController {
  constructor(
    private ProcessService: ProcessService,
    private ImageService: ImageService,
    private fileHandler: FileService,
    private supabaseService: SupabaseService,
    private UserService: UserService,
    private replicateService:replicateService
  ) {}

  //Grayscale
  @Post("grayscale")
  async grayscale(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
      })
      .parse(req.body);

    const { image_id } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleProcessEffect(
        stored_filepath,
        1,
        { amountB: 0, amountG: 0, amountR: 0 },
      );

      // //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/Grayscale`,
      );
      console.log("Chega aqui")
      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "Grayscale",
      });
      console.log("Chega aqui p2")
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");
      console.log("Chega aqui p3");

      res.status(201).send( {
        statusCode: 201,
        description: "Processamento do tipo Grayscale criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //Blur
  @Post("blur")
  async blur(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
        Amount: z
          .number({
            description: "",
          })
          .max(7)
          .min(1),
      })
      .parse(req.body);

    const { image_id, Amount } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleProcessEffect(
        stored_filepath,
        2,
        { amountB: 0, amountG: 0, amountR: Amount },
      );

      // //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/Blur`,
      );

      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "Blur",
      });
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");

      res.status(201).send(  {
        statusCode: 201,
        description: "Processamento do tipo blur criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //Canny
  @Post("canny")
  async Canny(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
        Amount: z
          .number({
            description: "",
          })
          .max(7)
          .min(1),
      })
      .parse(req.body);

    const { image_id, Amount } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleProcessEffect(
        stored_filepath,
        3,
        { amountB: 0, amountG: 0, amountR: Amount },
      );

      // //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/Canny`,
      );

      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "Canny",
      });
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");

      res.status(201).send( {
        statusCode: 201,
        description: "Processamento do tipo Canny criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //Change Brightness
  @Post("change_brightness")
  async change_brightness(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
        Amount: z
          .number({
            description: "",
          })
          .max(200)
          .min(-200),
      })
      .parse(req.body);

    const { image_id, Amount } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleProcessEffect(
        stored_filepath,
        11,
        { amountB: 0, amountG: 0, amountR: Amount },
      );

      // //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/Change_brightness`,
      );

      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "change_brightness",
      });
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");

      res.status(201).send( {
        statusCode: 201,
        description: "Processamento do tipo change_brightness criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //Pixelate
  @Post("pixelate")
  async Pixelate(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
        XRes:z.number({message:"X resolution of the image"}).min(16).max(128).default(32),
        YRes:z.number({message:"Y resolution of the image"}).min(16).max(128).default(32)
      })
      .parse(req.body);

    const { image_id,XRes,YRes } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleProcessEffect(
        stored_filepath,
        4,
        { amountB: 0, amountG: YRes, amountR: XRes },
      );

      // //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/Pixelate`,
      );

      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "Pixelate",
      });
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");

      res.status(201).send(  {
        statusCode: 201,
        description: "Processamento do tipo Pixelate criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //RGB Boost
  @Post("rgb_Boost")
  async rgb_boost(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
        Amount: z.object({
          amountB: z.number(),
          amountG: z.number(),
          amountR: z.number(),
        }),
      })
      .parse(req.body);

    const { image_id, Amount } = schema;
    const { amountB, amountG, amountR } = Amount;
    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleProcessEffect(
        stored_filepath,
        9,
        { amountB, amountG, amountR },
      );

      // //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/RGB_Boost`,
      );

      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "RGB_Boost",
      });
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");

      res.status(201).send(  {
        statusCode: 201,
        description: "Processamento do tipo RGBBoost criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //Negative
  @Post("negative")
  async negative(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
      })
      .parse(req.body);

    const { image_id } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleProcessEffect(
        stored_filepath,
        10,
        { amountB: 0, amountG: 0, amountR: 0 },
      );

      //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/Negative`,
      );

      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "Negative",
      });
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");

      res.status(201).send(  {
        statusCode: 201,
        description: "Processamento do tipo Negative criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //Skin whitering
  @Post("skin_Whitening")
  async skin_Whitening(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
        Amount:z.number().max(30).min(1).default(25)
      })
      .parse(req.body);

    const { image_id } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleProcessEffect(
        stored_filepath,
        12,
        { amountB: 0, amountG: 0, amountR: 25 },
      );

      //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/Skin_Whitening`,
      );

      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "Skin_Whitening",
      });
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");

      res.status(201).send(  {
        statusCode: 201,
        description: "Processamento do tipo Skin_Whitening criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //Heat
  @Post("heat")
  async heat(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
      })
      .parse(req.body);

    const { image_id } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleProcessEffect(
        stored_filepath,
        13,
        { amountB: 0, amountG: 0, amountR: 200 },
      );

      //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/Heat`,
      );

      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "Heat",
      });
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");

      res.status(201).send(  {
        statusCode: 201,
        description: "Processamento do tipo Heat criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //Background remover
  @Post("bg_remove")
  async bgremove(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
      })
      .parse(req.body);

    const { image_id } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse =
        await this.ProcessService.handleRemoveBg(stored_filepath);

      //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/RemoveBackground`,
      );

      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "RemoveBackground",
      });
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");

      res.status(201).send(  {
        statusCode: 201,
        description:
          "Processamento do tipo RemoveBackground criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //Reescale
  @Post("reescale")
  async reescale(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
        scale: z.number(),
      })
      .parse(req.body);

    const { image_id, scale } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleTransformation(
        stored_filepath,
        1,
        { p1: scale, p2: 0, p3: 0, p4: 0 },
      );

      //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/Reescale`,
      );

      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "Reescale",
      });
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");

      return {
        statusCode: 201,
        description: "Processamento do tipo Reescale criado com sucesso",
        process: created,
        image: base64,
      };
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //translate
  @Post("translate")
  async translate(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
        x: z.number(),
        y: z.number(),
      })
      .parse(req.body);

    const { image_id, x, y } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleTransformation(
        stored_filepath,
        2,
        { p1: x, p2: y, p3: 0, p4: 0 },
      );

      //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/Translate`,
      );

      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "Translate",
      });
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");

      res.status(201).send(  {
        statusCode: 201,
        description: "Processamento do tipo Translate criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //rotate
  @Post("rotate")
  async rotate(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
        angle: z.number(),
      })
      .parse(req.body);

    const { image_id, angle } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleTransformation(
        stored_filepath,
        3,
        { p1: angle, p2: 0, p3: 0, p4: 0 },
      );

      //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/Rotate`,
      );

      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "Rotate",
      });
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");

      res.status(201).send(  {
        statusCode: 201,
        description: "Processamento do tipo Rotate criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //cardinal_scale
  @Post("cardinal_scale")
  async cardinal_scale(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
        sx: z.number(),
        sy: z.number(),
      })
      .parse(req.body);

    const { image_id, sx, sy } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleTransformation(
        stored_filepath,
        4,
        { p1: sx, p2: sy, p3: 0, p4: 0 },
      );

      //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/CardinalScale`,
      );

      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "CardinalScale",
      });
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");

      res.status(201).send(  {
        statusCode: 201,
        description: "Processamento do tipo CardinalScale criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //crop
  @Post("crop")
  async crop(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
        x: z.number(),
        y: z.number(),
        w: z.number(),
        h: z.number(),
      })
      .parse(req.body);

    const { image_id, x, y, h, w } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleTransformation(
        stored_filepath,
        5,
        { p1: x, p2: y, p3: w, p4: h },
      );

      //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/Crop`,
      );

      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "Crop",
      });
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");

      res.status(201).send(  {
        statusCode: 201,
        description: "Processamento do tipo Crop criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post("flip")
  async flip(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
      })
      .parse(req.body);

    const { image_id} = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleTransformation(
        stored_filepath,
        6,
        { p1: 0, p2: 0, p3: 0, p4: 0 },
      );

      //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/flip`,
      );

      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "Flip Horizontal",
      });
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");

      res.status(201).send(  {
        statusCode: 201,
        description: "Processamento do tipo flip criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //pencil_sketch_filter
  @Post("pencil_sketch_filter")
  async pencil_sketch_filter(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
      })
      .parse(req.body);

    const { image_id } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleProcessEffect(
        stored_filepath,
        16,
        { amountB: 0, amountG: 0, amountR: 0 },
      );

      // //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/pencil_sketch_filter`,
      );
      
      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "pencilSketch",
      });
     
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");
      

      res.status(201).send( {
        statusCode: 201,
        description: "Processamento do tipo pencilSketch criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //cartoon_filter
  @Post("cartoon_filter")
  async cartoon_filter(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
      })
      .parse(req.body);

    const { image_id } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleProcessEffect(
        stored_filepath,
        15,
        { amountB: 0, amountG: 0, amountR: 0 },
      );

      // //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/cartoon_filter`,
      );
      
      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "cartoon",
      });
     
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");
      

      res.status(201).send( {
        statusCode: 201,
        description: "Processamento do tipo cartoon criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //sepia_filter
  @Post("sepia_filter")
  async sepia_filter(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
      })
      .parse(req.body);

    const { image_id } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
        await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const fileFolderResponse = await this.ProcessService.handleProcessEffect(
        stored_filepath,
        14,
        { amountB: 0, amountG: 0, amountR: 0 },
      );

      // //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse =
        await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/sepia_filter`,
      );
      
      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "sepia",
      });
     
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");
      

      res.status(201).send( {
        statusCode: 201,
        description: "Processamento do tipo Sépia criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //Face Detection
  @Post("face_detection")
  async face_detection(@Req() req: Request, @Res() res: Response) {
    const schema = z
      .object({
        image_id: z.string().uuid(),
        operation:z.enum(["isolate","censor"])
      })
      .parse(req.body);

    const { image_id, operation } = schema;

    try {
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } =
      await this.ImageService.findOne(image_id);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      //handle the process (calls python)
      const selcion = operation=="isolate"?1:2
      const fileFolderResponse = await this.ProcessService.runFaceDetecionsFunctions(stored_filepath,selcion)

      // //Upload to Supabase
      //LoadImage Local Buffer (from python saved directory)
      const localFileResponse = await this.fileHandler.loadImage(fileFolderResponse);

      //Load Public Url Doing and Upload of the local result python image to the supabase Bucket
      const publicPathUrl = await this.supabaseService.uploadToSupabase(
        {
          buffer: localFileResponse,
          mimetype: "png",
          originalname: original_filename,
        },
        `${name}/FaceDetection`,
      );
      
      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id,
        output_filename: publicPathUrl.public_url,
        operation: "FaceDetection",
      });
     
      //carregar imagem para retornar como base64
      const bufferResult = await this.fileHandler.loadImage(fileFolderResponse);
      // Transforma buffers em base64 e monta data URL
      const base64 = bufferResult.toString("base64");
      

      res.status(201).send( {
        statusCode: 201,
        description: "Processamento do tipo FaceDetection criado com sucesso",
        process: created,
        image: base64,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            description: "Imagem não encontrada",
            error: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          description: "Erro desconhecido",
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @Post("gen_by_ai")
  async gen_by_ai(@Req() req:Request, @Res() res:Response){
    const schema = z.object({
      prompt:z.string({
        message:"Por favor preencha a string obrigatória"
      }),
      userName:z.string()
    }).parse(req.body)
    
    const {prompt, userName} = schema

    try{
      const aigenUrl = await this.replicateService.run(prompt);
      console.log(aigenUrl)
      const loadFile = await this.fileHandler.loadImage(aigenUrl);
      console.log(loadFile)
      const storeToSupabase = await this.supabaseService.uploadToSupabase(
        {
          buffer:loadFile,
          mimetype:"png",
          originalname:"ai-"+randomUUID()+".png"
        },
        `${userName}/AI`
      )
      
      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id:"",
        output_filename: storeToSupabase.public_url,
        operation: "genByAI",
      });

      // Transforma buffers em base64 e monta data URL
      const base64 = loadFile.toString("base64");

      res.status(201).send( {
        statusCode: 201,
        description: "Processamento do tipo Generate ai criado com sucesso",
        process: created,
        image: base64,
      });

    }catch(err){
        res.status(500).send({
          description:"This route throws no know error",
          message:err.message
        })
    }
  }

  @Post("cartoom_90")
  async cartoom_90(@Req() req:Request, @Res() res:Response){
    const schema = z.object({
      imageId:z.string()
    }).parse(req.body)
    
    const {imageId} = schema

    try{
      //Find the Image Who we Want to Change
      const { stored_filepath, original_filename, user_id } = await this.ImageService.findOne(imageId);
      //Load User name
      const { name } = await this.UserService.userProfile(user_id);

      const aigenUrl = await this.replicateService.turnCartoon(stored_filepath);
      console.log(aigenUrl)
      const loadFile = await this.fileHandler.loadImage(aigenUrl);
      console.log(loadFile)
      const storeToSupabase = await this.supabaseService.uploadToSupabase(
        {
          buffer:loadFile,
          mimetype:"png",
          originalname:"ai-"+randomUUID()+".png"
        },
        `${name}/cartoom_90`
      )
      
      //Create the process as entity registering the sucess of the process operation
      const created = await this.ProcessService.create({
        image_id:"",
        output_filename: storeToSupabase.public_url,
        operation: "cartoom_90",
      });

      // Transforma buffers em base64 e monta data URL
      const base64 = loadFile.toString("base64");

      res.status(201).send( {
        statusCode: 201,
        description: "Processamento do tipo cartoom_90 ai criado com sucesso",
        process: created,
        image: base64,
      });

    }catch(err){
        res.status(500).send({
          description:"This route throws no know error",
          message:err.message
        })
    }
  }
}
