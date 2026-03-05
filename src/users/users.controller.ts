import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";
import { UserDto } from "./dtos/user.dto";

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get()
    findAll() {
        return this.userService.findAllUsers()
    }

    @Get(":id")
    find(@Param("id") id: string) {
        return this.userService.findUserById(id)
    }

    @Post()
    create(@Body() user: UserDto) {
        return this.userService.createUser(user)
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() user: UserDto) {
        return this.userService.updateUser(id, user);
    }

    @Delete(":id")
    delete(@Param("id") id: string) {
        return this.userService.deleteUser(id)
    }
}