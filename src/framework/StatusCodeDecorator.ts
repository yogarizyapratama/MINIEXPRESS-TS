import 'reflect-metadata';

export function StatusCode(code: number) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata('statusCode', code, target, propertyKey);
  };
}