import { Model, DataTypes } from 'sequelize';
import {sequelize} from '../config/database';

class User extends Model {
    public id!: string;
    public email!: string;
    public password!: string;
}

User.init({
    id: {
        type: DataTypes.UUID, // Tipe data UUID
        defaultValue: DataTypes.UUIDV4, // Default value adalah UUID versi 4
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
});

export default User;