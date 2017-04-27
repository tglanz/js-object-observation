const { Subject } = require('rxjs');

// Take an object, and return a proxy with an 'observation$' stream
const toObservableObject = targetObject => {
    const observation$ = new Subject();
    return new Proxy(targetObject, {
        set: (target, name, value) => {
            const oldValue = target[name];
            const newValue = value;
            target[name] = value;
            observation$.next({ name, oldValue, newValue });
        },

        get: (target, name) => name == 'observation$' ? observation$ : target[name]
    });
}

const observableObject = toObservableObject({ });

observableObject.observation$
    .filter(modification => modification.name == 'something')
    .subscribe(({ name, oldValue, newValue }) => console.log(`${name} changed from ${oldValue} to ${newValue}`));

observableObject.something = 1;
observableObject.something = 2;