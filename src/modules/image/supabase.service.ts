import { Injectable } from "@nestjs/common";
import { Multer } from "multer";
import { FileHandlingError } from "src/shared/errors/FileHandlingError";
import { bufferToStream } from "src/shared/functions/BufferToReadableStream";
import { supabase } from "src/shared/lib/supabase.client";

@Injectable()
export class SupabaseService {
    constructor(){}
    async uploadToSupabase(file:Express.Multer.File,uId:string) {
        const fileName = `${Date.now()}-${file.originalname}`;
        console.log(file.originalname, file.mimetype, file.buffer);
        const blob = new Blob([file.buffer], { type: file.mimetype });

        const { data, error } = await supabase
            .storage
            .from('main') // nome do bucket
            .upload(`${fileName}`, blob, {
              contentType: file.mimetype,
              upsert: true,duplex:"half"
        });
    
        if (error) {
            throw new FileHandlingError('Erro ao subir arquivo para Supabase');
        }
    
        const publicUrl = supabase
            .storage
            .from('main')
            .getPublicUrl(fileName).data.publicUrl;
    
        return {
            original_filename: file.originalname,
            stored_filepath: fileName,
            public_url: publicUrl
        };
    }

}