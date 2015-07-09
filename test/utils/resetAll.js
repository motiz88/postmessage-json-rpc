export default function resetAll(spies) {
    for (const name in spies)
        if (spies[name] && typeof spies[name].reset === 'function')
            spies[name].reset();
}