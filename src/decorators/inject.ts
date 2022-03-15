import 'reflect-metadata';

export class Injector {
  private static registry: Map<string, any> = new Map();

  static register(key: string, instance: any) {
    if (!Injector.registry.has(key)) {
      Injector.registry.set(key, instance);
    }
  }

  static get<T>(key: string) {
    return Injector.registry.get(key) as T;
  }
}
