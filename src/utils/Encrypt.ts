import bcrypt from 'bcrypt';

export default async function encrypt(password: string){
    return await bcrypt.hash(password, process.env.SALT || 10);
}