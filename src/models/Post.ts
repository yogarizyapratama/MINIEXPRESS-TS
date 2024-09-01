import { Model, DataTypes } from 'sequelize';
import {sequelize} from '../config/database';
import User from './User';

class Post extends Model {
  public id!: string;
  public title!: string;
  public content!: string;
  public user_id!: number;
}

Post.init({
  id: {
    type: DataTypes.UUID, // Tipe data UUID
    defaultValue: DataTypes.UUIDV4, // Default value adalah UUID versi 4
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Post',
  tableName: 'posts',
  timestamps: false,
});

User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });

export default Post;
