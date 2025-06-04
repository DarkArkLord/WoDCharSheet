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

export function downloadTextAsFile(fileName, data) {
    const blob = new Blob([data], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    link.click();

    URL.revokeObjectURL(link.href);
    link.remove();
}

export function loadFileAsText(onLoadHandler) {
    const fileElement = document.createElement('input');
    fileElement.type = 'file';
    fileElement.style.display = 'none';

    fileElement.onchange = (fileEvent) => {
        const file = fileEvent.target.files?.[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (readerEvent) => {
                const input = readerEvent.target.result ?? EMPTY_STRING;
                onLoadHandler(input);
            };

            reader.onerror = (readerEvent) => {
                alert('Ошибка загрузки');
                alert(readerEvent);
            };

            reader.readAsText(file, 'UTF-8');
        }

        fileElement.remove();
    };

    fileElement.click();
}