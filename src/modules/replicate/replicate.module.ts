import { Module } from "@nestjs/common";
import { replicateService } from "./replicate.service";
import { ConfigModule, ConfigService } from "@nestjs/config";




@Module({
    imports:[ConfigModule],
    providers: [replicateService,ConfigService],
    controllers: [],
    exports:[replicateService]
})
export class replicateModule {}
 