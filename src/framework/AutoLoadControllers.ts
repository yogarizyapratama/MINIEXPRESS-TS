import { Application, Request, Response, NextFunction } from 'express';
import { getRoutes, HttpMethod } from './HttpMethodDecorators';
import { isJWTRequired } from './JwtDecorators';
import { jwtMiddleware } from '../middlewares/JwtMiddleware';
import * as fs from 'fs';
import * as path from 'path';
import 'reflect-metadata';

export function loadControllers(app: Application, applyServices: Function) {
  const controllersDir = path.join(__dirname, '../controllers');

  fs.readdirSync(controllersDir).forEach(file => {
    const filePath = path.join(controllersDir, file);
    if (fs.lstatSync(filePath).isFile() && (file.endsWith('.ts') || file.endsWith('.js'))) {
      // Load controller
      const controller = require(filePath).default;
      const instance = new controller();
      applyServices(instance); // Inject services

      const routes = getRoutes().filter(route => route.controller === controller);
      const routePrefix = Reflect.getMetadata('routePrefix', controller);

      routes.forEach(route => {
        const fullPath = routePrefix + route.path;
        const method = route.method as HttpMethod;

        const middlewares = [];
       
        // Check if JWT is required for this route
        const jwtRequiredForMethod = isJWTRequired(controller.prototype, route.handler.name);
        const jwtRequiredForController = isJWTRequired(controller);

        if (jwtRequiredForMethod || jwtRequiredForController) {
          middlewares.push(jwtMiddleware);
        }

        middlewares.push(async (req: Request, res: Response, next: NextFunction) => {
          try {
            const result = await route.handler.call(instance, req, res, next);
            const statusCode = route.statusCode || 200;
            if (result) {
              res.status(statusCode).json(result); // Menggunakan return
            }
          } catch (error) {
            next(error);
          }
        });

        // Register route with middleware
        app[method](fullPath, ...middlewares);
      });
    }
  });
}