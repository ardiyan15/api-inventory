import { Module } from "@nestjs/common";
import { HashIdService } from "./hashid.service";

@Module({
    providers: [HashIdService],
    exports: [HashIdService]
})

export class HashIdModule {}