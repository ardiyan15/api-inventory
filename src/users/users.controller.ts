import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller('users')
export class UsersController{

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(@Req() req) {
        console.log('USER ', req.user)
        return "get all users";
    }
}