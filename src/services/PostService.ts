import Posts from '../models/Post';
import User from '../models/User';

export class PostService{
    async getPosts(){
        const posts = await Posts.findAll({
            include: [{
              model: User,
              attributes: ['email'], // Ambil hanya kolom yang diperlukan
            }],
          });

          return posts
    }
}