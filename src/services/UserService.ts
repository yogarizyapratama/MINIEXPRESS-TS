import User from '../models/User';
// import UserMongo from '../models/UserMongo';
import bcrypt from 'bcrypt';
import { HttpError } from '../middlewares/HttpError';
import { generateToken } from '../middlewares/JwtMiddleware';
import encrypt from '../utils/Encrypt';

export class UserService {
  async getUsers() {
    const data = await User.findAll()
    return data
  }

  async createUser(email: string, password: string) {
    const existingEmail = await User.findOne({where:{email}})

    if(existingEmail){
      throw new HttpError('Email Found, please use diffirent email!!!', 400)
    }

    const hashedPassword = await encrypt(password)

    // // save to mongodb
    // const succeedMongo = await UserMongo.create({
    //   email,
    //   password : hashedPassword
    // })

    // console.log(succeedMongo);
    

    // save to sequlize
    const succeed = await User.create({email, password: hashedPassword });
    if (succeed) return {message:'succeed'}
  }

  async loginUser(email:string, password:string){
    try {
      const user = await User.findOne({where:{email}})

      if(!user){
        const err = new Error('Email Not Found')
        throw err
      }

      const isValid = await this.validatePassword(user.password, password)

      if(isValid){
        return {
          token : generateToken(user)
        }
      }else{
        throw new HttpError('Invalid Password', 404)
      }
    } catch (error) {
      throw error
    }
  }

  async validatePassword(storedPassword: string, inputPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, storedPassword);
  }
}
