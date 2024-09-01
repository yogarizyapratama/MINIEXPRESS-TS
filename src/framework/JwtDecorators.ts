import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';

// Metadata key untuk menyimpan informasi apakah JWT diperlukan
const JWT_REQUIRED_KEY = Symbol('jwt_required');

export function UseJWT() {
  return function (target: any, propertyKey?: string) {
    if (propertyKey) {
      // Mengatur metadata di level metode
      Reflect.defineMetadata(JWT_REQUIRED_KEY, true, target, propertyKey);
    } else {
      // Mengatur metadata di level controller
      Reflect.defineMetadata(JWT_REQUIRED_KEY, true, target);
    }
  };
}

export function isJWTRequired(target: any, propertyKey?: string): boolean {
  // Cek di level metode terlebih dahulu, jika tidak ada cek di level controller
  const isRequiredOnMethod = propertyKey
    ? Reflect.getMetadata(JWT_REQUIRED_KEY, target, propertyKey)
    : undefined;
  
  const isRequiredOnClass = Reflect.getMetadata(JWT_REQUIRED_KEY, target);

  return isRequiredOnMethod === true || isRequiredOnClass === true;
}