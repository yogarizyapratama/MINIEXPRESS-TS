import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

interface RouteDefinition {
  method: HttpMethod;
  path: string;
  statusCode?: number;
  handler: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  controller: any;  // Tambahkan controller
}

const routes: RouteDefinition[] = [];

export function Controller(routePrefix: string) {
  return function (target: any) {
    Reflect.defineMetadata('routePrefix', routePrefix, target);
  };
}

export function Get(path: string) {
  return function (target: any, propertyKey: string) {
    const statusCode = Reflect.getMetadata('statusCode', target, propertyKey);
    routes.push({ method: 'get', path, handler: target[propertyKey], controller: target.constructor, statusCode });
  };
}

export function Post(path: string) {
  return function (target: any, propertyKey: string) {
    const statusCode = Reflect.getMetadata('statusCode', target, propertyKey);
    routes.push({ method: 'post', path, handler: target[propertyKey], controller: target.constructor, statusCode });
  };
}

export function Put(path: string) {
  return function (target: any, propertyKey: string) {
    const statusCode = Reflect.getMetadata('statusCode', target, propertyKey);
    routes.push({ method: 'put', path, handler: target[propertyKey], controller: target.constructor, statusCode });
  };
}

export function Delete(path: string) {
  return function (target: any, propertyKey: string) {
    const statusCode = Reflect.getMetadata('statusCode', target, propertyKey);
    routes.push({ method: 'delete', path, handler: target[propertyKey], controller: target.constructor, statusCode });
  };
}

export function getRoutes() {
  return routes;
}
