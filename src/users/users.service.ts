import { Injectable } from '@nestjs/common';
import { HashIdService } from 'src/common/hashid/hashid.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dtos/user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService, private hashIdService: HashIdService) { }

    async findAllUsers() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true
            },
            orderBy: {
                id: 'desc'
            }
        });

        return users.map(user => ({
            ...user,
            id: this.hashIdService.encode(user.id)
        }))
    }

    async findUserById(id: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: this.hashIdService.decode(id)
            },
            select: {
                id: true,
                email: true
            }
        })

        if (!user) return null;

        return {
            ...user,
            id: this.hashIdService.encode(user.id)
        }
    }

    async createUser(user: UserDto) {
        return this.prisma.user.create({
            data: {
                email: user.email,
                password: await bcrypt.hash(user.password, 10)
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }

    async deleteUser(id: string) {
        return this.prisma.user.delete({
            where: {
                id: this.hashIdService.decode(id)
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }

    async updateUser(id: string, user: UserDto) {
        const result = await this.prisma.user.update({
            where: {
                id: this.hashIdService.decode(id)
            },
            data: {
                email: user.email,
                password: await bcrypt.hash(user.password, 10)
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return {
            ...result,
            id: this.hashIdService.encode(result.id)
        }
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                email: true,
                password: true
            }
        })
    }
}
