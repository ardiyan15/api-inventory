import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private configService: ConfigService) {
        const secret = configService.get<string>('JWT_SECRET');
        console.log('JWT_SECRET =', secret); // 👈 ADD THIS

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        });
    }

    async validate(payload: any) {
        console.log('✅ JWT PAYLOAD:', payload);
        return { userId: payload.sub, email: payload.email }
    }
}