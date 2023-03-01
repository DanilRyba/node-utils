import { executeForEach } from "./helpers/array";

import { EventHandler, IEvent } from "./types/events";

export class Event<T = unknown> implements IEvent<T> {
    private _handlers: EventHandler<T>[] = [];

    constructor (private readonly _name: string) {}

    public on(handler: EventHandler<T>) {
        if (this._handlers.includes(handler)) {
            console.warn(`Handler already added to event "${this._name}"`);
            return null;
        }

        this._handlers.push(handler);

        return () => this.off(handler);
    }

    public off(handler: EventHandler<T>) {
        if (!this._handlers.includes(handler)) {
            return;
        }

        this._handlers = this._handlers.filter(h => h !== handler);
    }

    public async trigger(data?: T) {
        if (!this._handlers.length) {
            return;
        }

        const copiedHandlers = Array.from(this._handlers);

        await executeForEach(copiedHandlers, async (cb) => {
            try {
                await cb(data);
            } catch (err) {
                console.error(`Event "${this._name}" has error in handler`, err);
            }
        });
    }
}
