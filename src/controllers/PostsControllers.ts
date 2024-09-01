import { Request } from 'express';
import { Controller, Post, Get } from '../framework/HttpMethodDecorators';
import { InjectService } from '../framework/ServiceInjectDecorator';
import { PostService } from '../services/PostService';

@Controller('/posts')
export default class PostController {
  @InjectService(PostService)
  private postService!: PostService;

  @Get('/')
  async getPosts(req: Request) {
    return this.postService.getPosts()
  }
}