export class DarkEvent {
    constructor() {
        this.handlers = [];
    }

    addHandler(handler) {
        this.handlers.push(handler);
    }

    invoke() {
        for (const handler of this.handlers) {
            handler();
        }
    }
}

export class ValueWrapper {
    constructor(data, field, defaultValue) {
        this.data = data;
        this.field = field;

        if (field !== undefined && defaultValue !== undefined && this.data[this.field] === undefined) {
            this.setValue(defaultValue);
        }
    }

    getValue(defaultValue) {
        return this.data[this.field] ?? defaultValue;
    }

    setValue(value) {
        this.data[this.field] = value;
    }
}