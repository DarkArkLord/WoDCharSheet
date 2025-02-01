export class DarkEvent {
    handlers: Function[];

    constructor() {
        this.handlers = [];
    }

    addHandler(handler: Function): void {
        this.handlers.push(handler);
    }

    invoke(): void {
        for (const handler of this.handlers) {
            handler();
        }
    }
}

export class ValueWrapper<ValueType> {
    data: any;
    field: string;

    constructor(data: any, field: string, defaultValue?: ValueType) {
        this.data = data;
        this.field = field;

        if (field !== undefined && defaultValue !== undefined && this.data[this.field] === undefined) {
            this.setValue(defaultValue);
        }
    }

    getValue(defaultValue?: ValueType): ValueType {
        return this.data[this.field] ?? defaultValue;
    }

    setValue(value: ValueType): void {
        this.data[this.field] = value;
    }
}