import { Request } from 'express';
import { Controller, Get, Post } from '../framework/HttpMethodDecorators';
import { InjectService } from '../framework/ServiceInjectDecorator';
import { UserService } from '../services/UserService';
import { UseJWT } from '../framework/JwtDecorators';
import { StatusCode } from '../framework/StatusCodeDecorator';
import User from '../models/User';

// @UseJWT() 
@Controller('/users')
export default class UsersController {
  @InjectService(UserService)
  private userService!: UserService;

  @UseJWT()
  @Get('/')
  getAllUsers(req: Request) : Promise<User[]> {
    return this.userService.getUsers();
  }

  @Post('/login')
  @StatusCode(200)
  async loginUser(req: Request) : Promise<object> {
    const {email, password } = req.body;

    if (!password || !email) {
      throw new Error('password and email are required');
    }

    return this.userService.loginUser(email, password)
  }

  @Post('/register')
  @StatusCode(201)
  async createUser(req: Request) {
    const {email, password } = req.body;
  
    if (!password || !email) {
      throw new Error('password and email are required');
    }
    const user = await this.userService.createUser(email, password);
    return user
  }
}
