import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { sequelize, connectMongoDB } from '../config/database';
import { loadControllers } from './AutoLoadControllers';
import { errorHandler } from '../middlewares/ErrorHandlerMiddlaware';
import { applyServices } from './ServiceInjectDecorator';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

export class MiniFramework {
  public app: Application;
  private logger: winston.Logger;

  constructor() {
    this.app = express();
    this.logger = this.createLogger();
    this.overrideConsole();
    this.config();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cookieParser());
  }

  public async syncDB(dev: boolean = false) {
    try {
      await sequelize.sync({ force: dev });
    } catch (error) {
      throw error
    }
  }

  // Method untuk menghubungkan ke database
  public async connectDatabases(db?: { dbName: string, config: object }) {
    const useSequelize = db?.dbName === 'sequelize'
    const useMongoDB = db?.dbName === 'mongodb'

    if (useSequelize) {
      try {
        await sequelize.authenticate()
        this.syncDB()
        console.log('Sequelize: Database connected successfully');
      } catch (error) {
        throw error
      }
    }

    if (useMongoDB) {
      try {
        await connectMongoDB(); // Hubungkan ke MongoDB
      } catch (error) {
        console.error('MongoDB: Unable to connect:', error);
        throw error;
      }
    }

    if (!useSequelize && !useMongoDB) {
      console.warn('No database enabled. Please enable at least one database in the .env file.');
    }
  }

  // Setup Winston logger
  private createLogger(): winston.Logger {
    return winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(), // Menambahkan warna
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
      ]
    });
  }

  // Override console methods to use Winston
  private overrideConsole(): void {
    const logger = this.logger;

    console.log = function (message: any, ...optionalParams: any[]) {
      logger.info(message, ...optionalParams);
    };

    console.error = function (message: any, ...optionalParams: any[]) {
      logger.error(message, ...optionalParams);
    };

    console.warn = function (message: any, ...optionalParams: any[]) {
      logger.warn(message, ...optionalParams);
    };

    console.info = function (message: any, ...optionalParams: any[]) {
      logger.info(message, ...optionalParams);
    };

    console.debug = function (message: any, ...optionalParams: any[]) {
      logger.debug(message, ...optionalParams);
    };
  }

  public useMiddleware(middlewares: any) {
    this.app.use(middlewares)
  }

  public async start(port: any, db?: { dbName: string, config: object }) {
    try {
      await this.connectDatabases(db)

      loadControllers(this.app, applyServices);
      this.app.use(errorHandler);

      this.app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    } catch (err) {
      console.error('Unable to connect to the database:', err);
    }
  }
}