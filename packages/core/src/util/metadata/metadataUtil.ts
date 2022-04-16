import 'reflect-metadata';

export type MetaDataKey = symbol | string;

export type MetadataClass<T = object> = new(...args: any[]) => T;

export class MetadataUtil {
  static defineMetadata<T>(metadataKey: MetaDataKey, metadataValue: T, clazz: MetadataClass) {
    Reflect.defineMetadata(metadataKey, metadataValue, clazz);
  }

  static hasMetadata(metadataKey: MetaDataKey, clazz: MetadataClass) {
    return Reflect.hasMetadata(metadataKey, clazz);
  }

  static getMetadata<T>(metadataKey: MetaDataKey, clazz: MetadataClass): T | undefined {
    return Reflect.getMetadata(metadataKey, clazz);
  }

  static getOwnMetadata<T>(metadataKey: MetaDataKey, clazz: MetadataClass): T | undefined {
    return Reflect.getOwnMetadata(metadataKey, clazz);
  }

  static getOrStoreMetaData<T>(metadataKey: MetaDataKey, clazz: MetadataClass, metadataValue: T): T {
    if (!Reflect.hasMetadata(metadataKey, clazz)) {
      Reflect.defineMetadata(metadataKey, metadataValue, clazz);
    }
    return Reflect.getMetadata(metadataKey, clazz);
  }

  static initOwnMapMetadata<K, V>(metadataKey: MetaDataKey, clazz: MetadataClass, defaultValue: Map<K, V>): Map<K, V> {
    const ownMetaData: Map<K, V> | undefined = this.getOwnMetadata(metadataKey, clazz);
    if (!ownMetaData) {
      const parentValue: Map<K, V> | undefined = this.getMetadata(metadataKey, clazz);
      const selfValue = new Map<K, V>();
      const ownDefaultValue = parentValue || defaultValue;
      for (const [k, v] of ownDefaultValue) {
        selfValue.set(k, v);
      }
      this.defineMetadata(metadataKey, selfValue, clazz);
    }
    return this.getOwnMetadata<Map<K, V>>(metadataKey, clazz)!;
  }
}
