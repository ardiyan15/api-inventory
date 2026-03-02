import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    private users = [
        {
            id: 1,
            email: 'test@gmail.com',
            password: '$2b$10$o3Viydh6KqrhsgGvlN0ktuyeENxO8ZpQeuwcjdL1Xyr8.6HjZzHoa'
        }
    ]

    async findByEmail(email: string) {
        return this.users.find(user => user.email === email);
    }
}
