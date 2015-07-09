export default function defer(test, time) {
    return new Promise((resolve, reject) =>
        setTimeout(() => {
            try {
                test();
                resolve();
            } catch (e) {
                reject(e);
            }
        }, time || 500)
    );
}
