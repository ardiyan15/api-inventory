import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { HashIdService } from 'src/common/hashid/hashid.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dtos/user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService, private hashIdService: HashIdService, private readonly logger: PinoLogger) {
        this.logger.setContext(UsersService.name);
    }

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

        this.logger.info('Fetching all users');

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

        if (!user) {

            this.logger.info(
                {
                    method: 'findUserById',
                    file: 'user.service.ts'
                },
                'Failed to fetch user by id'
            );

            return null;
        }

        this.logger.info(
            {
                method: 'findUserById',
                file: 'user.service.ts',
                userId: this.hashIdService.decode(id)
            },

            'Success fetching user by id'
        );

        return {
            ...user,
            id: this.hashIdService.encode(user.id)
        }
    }

    async createUser(user: UserDto) {
        try {
            const result = await this.prisma.user.create({
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

            this.logger.info(
                {
                    method: 'createUser',
                    file: 'user.service.ts',
                    result: result
                },
                'Success to create user'
            );

            return result
        } catch (error) {
            this.logger.error(
                {
                    method: 'createUser',
                    file: 'user.service.ts'
                },
                'Failed to create user'
            );
            throw new InternalServerErrorException(error)
        }
    }

    async deleteUser(id: string) {
        try {
            const result = await this.prisma.user.delete({
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

            this.logger.info(
                {
                    method: 'deleteUser',
                    file: 'user.service.ts',
                    result: result
                },
                'Success to delete user'
            );

            return result
        } catch (error) {
            this.logger.error(
                {
                    method: 'deleteUser',
                    file: 'user.service.ts'
                },
                'Failed to delete user'
            );
            throw new InternalServerErrorException(error)
        }
    }

    async updateUser(id: string, user: UserDto) {
        try {
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

            this.logger.info(
                {
                    method: 'updateUser',
                    file: 'user.service.ts',
                    result: result
                },
                'Success to update user'
            );

            return {
                ...result,
                id: this.hashIdService.encode(result.id)
            }
        } catch (error) {
            this.logger.error(
                {
                    method: 'updateUser',
                    file: 'user.service.ts'
                },
                'Failed to update user'
            );
            throw new InternalServerErrorException(error)
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
