export default function spyAll(object) {
    if (object && typeof object === 'object')
        Object.keys(object).forEach(name => {
            if (typeof object[name] === 'function')
                object[name] = sinon.spy(object, name);
        });
    return object;
}