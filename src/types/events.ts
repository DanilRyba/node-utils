export interface IEvent<T = unknown> {
    on(handler: EventHandler): (() => void) | null;
    off(handler: EventHandler): void;

    trigger(data?: T): Promise<Error[]>;
}

export type EventHandler<T = unknown> = (data?: T) => void | Promise<void>;
