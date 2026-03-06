import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('PrismaQuery');

    constructor() {
        super({
            log: [
                {
                    emit: 'event',
                    level: 'query'
                }
            ]
        })
    }

    async onModuleInit() {
        this.$on('query', (e) => {
            this.logger.log(`
                Query: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms
            `)
        })
        
        await this.$connect()
    }
}