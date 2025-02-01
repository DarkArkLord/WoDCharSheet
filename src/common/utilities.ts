declare interface IEvent {
    addHandler(handler: Function): void;
    invoke(): void;
}

export class DarkEvent implements IEvent {
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

declare interface IValueWrapper<ValueType> {
    getValue(defaultValue?: ValueType): ValueType;
    setValue(value: ValueType): void;
}

export class ValueWrapper<ValueType> implements IValueWrapper<ValueType> {
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