import { SVGIcons } from './svg.js'
import { HTMLTags, render } from './render.js'
import { UITextInputType, UITextInput, UIText, UIIcon, UIPointsLine } from './uiElements.js'

const CSS = Object.freeze({
    TABLE: 'table',
    TABLE_ROW: 'tr',
    TABLE_DATA: 'td',
    LEFT_PADDING_5: 'left-padding-5px',
});

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

class CharValueWrapper {
    constructor(data, field, defaultValue, prevFileds = [], nextFileds = []) {
        this.data = data;
        this.field = field;
        this.prevFileds = prevFileds;
        this.nextFileds = nextFileds;

        if (field !== undefined && defaultValue !== undefined && this.data[this.field] === undefined) {
            this.setValue(defaultValue);
        }
    }

    getValue() {
        return this.data[this.field] ?? 0;
    }

    setValue(value) {
        this.data[this.field] = value;
    }

    getSpecialty() {
        return this.data.specialty ?? '';
    }

    setSpecialty(value) {
        this.data.specialty = value;
    }

    getPrevValue() {
        let result = 0;

        for (const field of this.prevFileds) {
            result += this.data[field] ?? 0;
        }

        return result;
    }

    getNextValue() {
        let result = 0;

        for (const field of this.nextFileds) {
            result += this.data[field] ?? 0;
        }

        return result;
    }

    getTotalValue() {
        return this.getPrevValue() + this.getValue() + this.getNextValue();
    }

    hasNextValue() {
        for (const field of this.nextFileds) {
            if (this.data[field]) {
                return true;
            }
        }

        return false;
    }
}

class CharValuePriceWrapper {
    constructor(valueWrapper, priceFunc) {
        this.valueWrapper = valueWrapper;
        this.priceFunc = priceFunc;
        this.isDirty = true;
        this.price = 0;
    }

    calculate() {
        this.price = 0;

        if (this.priceFunc) {
            const prev = this.valueWrapper.getPrevValue();
            const value = this.valueWrapper.getValue();
            for (let cur = 0; cur < value; cur++) {
                this.price += this.priceFunc(prev + cur);
            }
        }

        return this.price;
    }

    setDirty() {
        this.isDirty = true;
    }

    getPrice() {
        if (this.isDirty) {
            this.calculate();
        }

        return this.price;
    }
}

const DEFAULT_POINTS_COUNT = 5;
const EMPTY_STRING = '';

export class CharLineValueElement {
    constructor(input) {
        const {
            keeper,
            valueInfo,
            validations,
            validationsField,
            updateEvent,
            pointsCount = DEFAULT_POINTS_COUNT,
        } = input;

        const instance = this;

        this.updateEvent = updateEvent;

        this.info = valueInfo;

        this.validations = validations;
        this.validationsField = validationsField;
        this.valueValidations = this.validations?.[validationsField];
        this.isEditable = validations?.editable;

        this.data = keeper[valueInfo.id] = keeper[valueInfo.id] ?? {};
        this.wrapper = new CharValueWrapper(
            this.data,
            this.validations?.valueField,
            this.valueValidations?.min,
            this.validations?.prev,
            this.validations?.next,
        );
        this.priceWrapper = new CharValuePriceWrapper(this.wrapper, this.valueValidations?.price);

        const firstColumnAttrs = { class: CSS.TABLE_DATA };
        const otherColumnAttrs = { class: `${CSS.TABLE_DATA} ${CSS.LEFT_PADDING_5}` };

        this.text = new UIText(EMPTY_STRING, firstColumnAttrs);
        this.specialty = new UITextInput(otherColumnAttrs);
        this.points = new UIPointsLine(pointsCount, this.isEditable, otherColumnAttrs);
        this.pointsText = new UIText(EMPTY_STRING, otherColumnAttrs);

        this.pointsText.setVisible(this.isEditable);

        if (this.isEditable) {
            this.specialty.setOnChangedEvent(() => {
                const specialty = instance.specialty.getValue();
                instance.wrapper.setSpecialty(specialty);

                instance.update();
                instance.updateEvent.invoke();
            });

            this.points.subButton.setOnClickEvent(() => {
                const value = instance.wrapper.getValue();
                instance.wrapper.setValue(value - 1);

                instance.update();
                instance.updateEvent.invoke();
            });

            this.points.addButton.setOnClickEvent(() => {
                const value = instance.wrapper.getValue();
                instance.wrapper.setValue(value + 1);

                instance.update();
                instance.updateEvent.invoke();
            });
        }

        this.element = render(
            HTMLTags.Div,
            { class: CSS.TABLE },
            render(
                HTMLTags.Div,
                { class: CSS.TABLE_ROW },
                this.text.element,
                this.specialty.element,
                this.points.element,
                this.pointsText.element,
            ),
        );

        this.update();
    }

    update() {
        const prevValue = this.wrapper.getPrevValue()
        const value = this.wrapper.getValue()
        const hasNextValue = this.wrapper.hasNextValue();
        const totalValue = this.wrapper.getTotalValue();

        this.pointsText.setText(`(${value})`);

        const specialtyEditableFrom = this.valueValidations?.specialty;
        if (specialtyEditableFrom) {
            this.specialty.setVisible(true);

            const isSpecialtyEditable = totalValue >= specialtyEditableFrom
            this.specialty.setReadOnly(!isSpecialtyEditable);

            if (isSpecialtyEditable) {
                this.specialty.setValue(this.wrapper.getSpecialty());
            } else {
                this.wrapper.setSpecialty(EMPTY_STRING);
                this.specialty.setValue(EMPTY_STRING);
            }

            this.text.setText(this.info.translation);
        } else {
            this.specialty.setVisible(false);

            const crudeText = this.wrapper.getSpecialty().trim();
            const text = crudeText.length > 0
                ? `${this.info.translation} (${crudeText})`
                : this.info.translation
            this.text.setText(text);
        }

        if (this.isEditable) {
            this.points.setValue(prevValue, value);

            const enableSubButton = this.valueValidations?.min === undefined ? true : value > this.valueValidations?.min;
            this.points.subButton.setActive(enableSubButton && !hasNextValue);
            const enableAddButton = this.valueValidations?.max === undefined ? true : value < this.valueValidations?.max;
            this.points.addButton.setActive(enableAddButton && !hasNextValue);
        } else {
            this.points.setValue(0, totalValue);
        }

        this.priceWrapper.setDirty();
    }

    validate() {
        const errors = [];

        const totalValue = this.wrapper.getTotalValue();
        if (totalValue < this.valueValidations?.totalMin) {
            errors.push({
                level: this.validations?.valueTranslation,
                value: this.info.translation,
                text: `Не может быть меньше ${this.valueValidations?.totalMin}`,
            });
        }
        if (totalValue > this.valueValidations?.totalMax) {
            errors.push({
                level: this.validations?.valueTranslation,
                value: this.info.translation,
                text: `Не может быть больше ${this.valueValidations?.totalMax}`,
            });
        }

        return errors;
    }
}

export class CharLineValuesSectionElement {
    constructor(input) {
        const {
            keeper,
            sectionInfo,
            validations,
            validationsField,
            updateEvent,
        } = input;

        this.updateEvent = updateEvent;

        this.info = sectionInfo;

        this.items = sectionInfo?.values?.map(valueInfo => new CharLineValueElement({
            keeper,
            valueInfo,
            validations,
            validationsField,
            updateEvent,
        })) ?? [];

        this.element = render(
            HTMLTags.Div,
            { class: CSS.TABLE },
            render(
                HTMLTags.Div,
                { class: CSS.TABLE_ROW },
                render(
                    HTMLTags.Div,
                    { class: CSS.TABLE_DATA },
                    sectionInfo.translation,
                ),
            ),
            this.items.map(item => render(
                HTMLTags.Div,
                { class: CSS.TABLE_ROW },
                item.element,
            )),
        );
    }
}