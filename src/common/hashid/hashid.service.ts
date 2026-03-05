import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Hashids from "hashids";

@Injectable()
export class HashIdService {
    private hashIds: Hashids;

    constructor(private configService: ConfigService) {
        const salt = this.configService.get<string>('SECRET_SALT');
        this.hashIds = new Hashids(salt, 10);
    }

    encode(id: number) {
        return this.hashIds.encode(id)
    }

    decode(hash: string) {
        return this.hashIds.decode(hash)[0] as number
    }
}