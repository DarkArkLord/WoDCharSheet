import { SVGIcons } from './svg.js'
import { ValueWrapper } from './utilities.js'
import { UIPointsLine, UIText } from './uiElements.js'
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

        const dotsInputValidations = partValidations?.dotsInput;
        const dotsCount = dotsInputValidations?.dotsCount ?? DEFAULT_DOTS_COUNT;
        const isEditable = validations?.editable && partValidations?.editable;

        const wrapper = new ValueByStateWrapper(
            data,
            validations?.state,
            dotsInputValidations?.min,
            validations?.prev,
            validations?.next,
        );
        const priceWrapper = new DotsValuePriceWrapper(wrapper, dotsInputValidations?.price);

        // Elements
        const dots = new UIPointsLine(dotsCount, isEditable);
        const subButton = dots.getSubButton();
        const addButton = dots.getAddButton();

        if (isEditable) {
            subButton.setOnClickEvent(() => {
                const value = wrapper.getValue();
                wrapper.setValue(value - 1);

                priceWrapper.setDirty();

                updateEvent.invoke();
            });

            addButton.setOnClickEvent(() => {
                const value = wrapper.getValue();
                wrapper.setValue(value + 1);

                priceWrapper.setDirty();

                updateEvent.invoke();
            });
        }

        this.private = {
            updateEvent,
            isEditable,
            validations: {
                info: dataForValidations,
                main: validations,
                part: partValidations,
                dots: dotsInputValidations,
                dotsCount,
            },
            data: {
                data,
                wrapper,
                priceWrapper,
            },
            elements: {
                dots,
                subButton,
                addButton,
            },
        };
    }

    getElement() {
        return this.private.elements.dots.getElement();
    }

    update() {
        const wrapper = this.private.data.wrapper;
        const elements = this.private.elements;

        if (this.private.isEditable) {
            const prevValue = wrapper.getPrevValue();
            const value = wrapper.getValue(0);
            const hasNextValue = wrapper.hasNextValue();

            elements.dots.setValue(prevValue, value);

            const validations = this.private.validations;

            const enableSubButton = validations.dots?.min === undefined ? true : value > validations.dots?.min;
            elements.subButton.setActive(enableSubButton && !hasNextValue);

            const enableAddButton = (validations.dots?.max === undefined ? true : value < validations.dots?.max)
                && prevValue + value < validations.dotsCount;
            elements.addButton.setActive(enableAddButton && !hasNextValue);
        } else {
            const totalValue = wrapper.getTotalValue(0);
            elements.dots.setValue(0, totalValue);
        }
    }

    validate() {
        const errors = [];

        const wrapper = this.private.data.wrapper;
        const validations = this.private.validations.dots;
        const totalValue = wrapper.getPrevValue() + wrapper.getValue(0);
        if (totalValue < validations?.totalMin) {
            errors.push({
                ...this.private.validations.info,
                text: `Не может быть меньше ${validations?.totalMin} (сейчас ${totalValue})`,
            });
        }
        if (totalValue > validations?.totalMax) {
            errors.push({
                ...this.private.validations.info,
                text: `Не может быть больше ${validations?.totalMax} (сейчас ${totalValue})`,
            });
        }

        return errors;
    }

    getPrice() {
        return this.private.data.priceWrapper.getPrice();
    }
}

class CharUiTextWithDotsElement {
    constructor(input) {
        const {
            data: {
                keeper,
                valueInfo,
            },
            validations: {
                validations,
                partValidations,
                dataForValidations,
            },
            updateEvent,
        } = input;

        const isEditable = validations?.editable && partValidations?.editable;

        const validationsInfo = { ...dataForValidations, value: valueInfo.translation, };

        const data = keeper[valueInfo.id] = keeper[valueInfo.id] ?? {};

        // Elements
        const text = new UIText(valueInfo.translation, {});
        const dots = new CharUiDotsElement({
            data,
            validations: {
                validations,
                partValidations,
                dataForValidations: validationsInfo,
            },
            updateEvent,
        });

        this.private = {
            updateEvent,
            isEditable,
            validations: {
                info: validationsInfo,
                main: validations,
                part: partValidations,
            },
            data: {
                data,
                info: valueInfo,
            },
            elements: {
                text,
                dots,
            }
        };
    }

    update() {
        this.private.elements.dots.update();
    }

    validate() {
        const errors = this.private.elements.dots.validate() ?? [];

        this.setHighlight(errors.length > 0);

        return errors;
    }

    setHighlight(isVisible) {
        // Fix
        if (isVisible) {
            this.text.element.classList.add(CSS.BORDER_RED_1);
            this.dots.element.classList.add(CSS.BORDER_RED_1);
        } else {
            this.text.element.classList.remove(CSS.BORDER_RED_1);
            this.dots.element.classList.remove(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        return this.private.elements.dots.getPrice();
    }
}
