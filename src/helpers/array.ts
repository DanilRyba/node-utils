export async function executeForEach<T>(target: ReadonlyArray<T>, cb: (value: T) => Promise<void>) {
    for (let v of target) {
        await cb(v);
    }
}
