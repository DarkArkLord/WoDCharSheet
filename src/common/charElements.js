import { SVGIcons } from './svg.js'
import { ValueWrapper } from './utilities.js'
import { UIPointsLine } from './uiElements.js'
import { DElementBuilder, ATTRIBUTES, EVENTS, ACTIONS } from './domWrapper.js'

const CSS = Object.freeze({
    TEXT_ALIGN_CENTER: 'text-align-center',
    BORDER_RED_1: 'border-red-1',
    DROPDOWN_AS_BUTTON: 'dropdown-as-button',
});

class ValueByStateWrapper extends ValueWrapper {
    constructor(data, field, defaultValue, prevFileds = [], nextFileds = []) {
        super(data, field, defaultValue);

        this.prevFileds = prevFileds;
        this.nextFileds = nextFileds;
    }

    getPrevValue() {
        let result = 0;

        for (const field of this.prevFileds) {
            result += this.data[field] ?? 0;
        }

        return result;
    }

    hasPrevValue() {
        for (const field of this.prevFileds) {
            if (this.data[field]) {
                return true;
            }
        }

        return false;
    }

    getNextValue() {
        let result = 0;

        for (const field of this.nextFileds) {
            result += this.data[field] ?? 0;
        }

        return result;
    }

    hasNextValue() {
        for (const field of this.nextFileds) {
            if (this.data[field]) {
                return true;
            }
        }

        return false;
    }

    getTotalValue(defaultValue) {
        return this.getPrevValue() + this.getValue(defaultValue) + this.getNextValue();
    }
}

class DotsValuePriceWrapper {
    constructor(dotsValueWrapper, priceFunc) {
        this.dotsValueWrapper = dotsValueWrapper;
        this.priceFunc = priceFunc;
        this.isDirty = true;
        this.price = 0;
    }

    calculate() {
        this.price = 0;

        if (this.priceFunc) {
            const prev = this.dotsValueWrapper.getPrevValue();
            const value = this.dotsValueWrapper.getValue();
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

const DEFAULT_DOTS_COUNT = 5;
const DEFAULT_INPUT_SIZE = 10;
const EMPTY_STRING = '';

const DEFAULT_COMPARATOR = (a, b) => b - a;

const SPECIALTY_FIELD = 'specialty'
const TEXT_FIELD = 'text';
const TYPE_FIELD = 'type';

class CharUiDotsElement {
    constructor(input) {
        const {
            data,
            validations: {
                validations,
                partValidations,
                dataForValidations,
            },
            updateEvent,
        } = input;

        const instance = this;

        this.updateEvent = updateEvent;

        this.validations = validations;
        this.partValidations = partValidations;
        this.dotsInputValidations = partValidations?.dotsInput;
        this.dotsCount = this.dotsInputValidations?.dotsCount ?? DEFAULT_DOTS_COUNT;
        this.isEditable = validations?.editable && partValidations?.editable;

        this.validationsInfo = dataForValidations;

        this.data = data;
        this.wrapper = new ValueByStateWrapper(
            this.data,
            this.validations?.state,
            this.dotsInputValidations?.min,
            this.validations?.prev,
            this.validations?.next,
        );
        this.priceWrapper = new DotsValuePriceWrapper(this.wrapper, this.dotsInputValidations?.price);

        // Elements
        this.dots = new UIPointsLine(this.dotsCount, this.isEditable);
        this.subButton = this.dots.getSubButton();
        this.addButton = this.dots.getAddButton();

        if (this.isEditable) {
            this.subButton.setOnClickEvent(() => {
                const value = instance.wrapper.getValue();
                instance.wrapper.setValue(value - 1);

                instance.priceWrapper.setDirty();

                instance.updateEvent.invoke();
            });

            this.addButton.setOnClickEvent(() => {
                const value = instance.wrapper.getValue();
                instance.wrapper.setValue(value + 1);

                instance.priceWrapper.setDirty();

                instance.updateEvent.invoke();
            });
        }
    }

    getElement() {
        return this.dots.getElement();
    }

    update() {
        if (this.isEditable) {
            const prevValue = this.wrapper.getPrevValue();
            const value = this.wrapper.getValue(0);
            const hasNextValue = this.wrapper.hasNextValue();

            this.dots.setValue(prevValue, value);

            const enableSubButton = this.dotsInputValidations?.min === undefined ? true : value > this.dotsInputValidations?.min;
            this.subButton.setActive(enableSubButton && !hasNextValue);
            const enableAddButton = (this.dotsInputValidations?.max === undefined ? true : value < this.dotsInputValidations?.max)
                && prevValue + value < this.dotsCount;
            this.addButton.setActive(enableAddButton && !hasNextValue);
        } else {
            const totalValue = this.wrapper.getTotalValue(0);
            this.dots.setValue(0, totalValue);
        }
    }

    validate() {
        const errors = [];

        const totalValue = this.wrapper.getPrevValue() + this.wrapper.getValue(0);
        if (totalValue < this.dotsInputValidations?.totalMin) {
            errors.push({
                ...this.validationsInfo,
                text: `Не может быть меньше ${this.dotsInputValidations?.totalMin} (сейчас ${totalValue})`,
            });
        }
        if (totalValue > this.dotsInputValidations?.totalMax) {
            errors.push({
                ...this.validationsInfo,
                text: `Не может быть больше ${this.dotsInputValidations?.totalMax} (сейчас ${totalValue})`,
            });
        }

        return errors;
    }

    getPrice() {
        return this.priceWrapper.getPrice();
    }
}