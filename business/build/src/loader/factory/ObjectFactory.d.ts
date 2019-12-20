declare class Factory {
    private static _instance;
    private factory;
    static readonly instance: Factory;
    register<T>(name: string, objectInstance: T): void;
    getObjectInstance<T>(name: string): T;
}
export declare const ObjectFactory: Factory;
export {};