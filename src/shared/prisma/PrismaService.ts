import { OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { JsPromise } from "@prisma/client/runtime/library";

export class PrismaService extends PrismaClient implements OnModuleInit{
    async onModuleInit() {
        await this.$connect();
    }
}