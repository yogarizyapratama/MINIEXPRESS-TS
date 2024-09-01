import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';

const services = new Map();

export function InjectService(serviceClass: any) {
  return function (target: any, propertyKey: string) {
    if (!services.has(serviceClass)) {
      services.set(serviceClass, new serviceClass());
    }
    target[propertyKey] = services.get(serviceClass);
  };
}

export function applyServices(instance: any) {
  const serviceKeys = Reflect.getMetadata('design:paramtypes', instance.constructor) || [];
  serviceKeys.forEach((ServiceClass: any, index: number) => {
    const serviceInstance = services.get(ServiceClass);
    if (serviceInstance) {
      instance[Object.keys(instance)[index]] = serviceInstance;
    }
  });
}
