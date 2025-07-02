import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import * as path from "path";
import { mkdir } from "node:fs/promises";
import ReplicateInterface from "replicate";
const Replicate: typeof ReplicateInterface = require("replicate");

@Injectable()
export class replicateService {
    private replicate: InstanceType<typeof Replicate>;

    constructor(private configService: ConfigService) {
            this.replicate = new Replicate({
            auth: this.configService.get<string>("REPLICATE_API_TOKEN"),
            });
    }
    async run(prompt:string){
        const input = {
            prompt,
        };

        
        const output = await this.replicate.run("black-forest-labs/flux-dev",{input:{prompt}})

        // Verifica se há saída válida
        if (!output || !Array.isArray(output) || !output[0]) {
        throw new Error("Nenhuma imagem foi gerada.");
        }

        const imageUrl = output[0]; // geralmente uma string com URL
        console.log("Imagem gerada:", imageUrl);

        // To access the file URL:
        console.log(output[0].url());
        
        // Baixa a imagem
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const filename = `ai-${randomUUID()}.png`;
        const uploadDir = path.resolve(__dirname, "..", "..", "..", "uploads", "temp");
        const filepath = path.join(uploadDir, filename);

        // Certifique-se que a pasta existe (opcional, mas recomendado)
        
        await mkdir(uploadDir, { recursive: true });

        // Agora salva no caminho completo
        await writeFile(filepath, buffer);

        console.log({
            description:"Imagem Salva",
            path: filepath
        });

        return filepath;
    }
}