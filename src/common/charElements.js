import { SVGIcons } from './svg.js'
import { ValueWrapper } from './utilities.js'
import { UIPointsLine, UIText, UITextInput } from './uiElements.js'
import { DElementBuilder, ATTRIBUTES, EVENTS, ACTIONS, DTableBuilder } from './domWrapper.js'

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
                info: valueInfo,
                data,
                dotsWrapper: dots.private.data.wrapper,
                priceWrapper: dots.private.data.priceWrapper,
            },
            elements: {
                text,
                dots,
            }
        };
    }

    getTextElement() {
        return this.private.elements.text.getElement();
    }
    getDotsElement() {
        return this.private.elements.dots.getElement();
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
        const text = this.getTextElement();
        const dots = this.getDotsElement();

        if (isVisible) {
            text.addClass(CSS.BORDER_RED_1);
            dots.addClass(CSS.BORDER_RED_1);
        } else {
            text.removeClass(CSS.BORDER_RED_1);
            dots.removeClass(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        return this.private.elements.dots.getPrice();
    }
}

class CharUiLineDotsElement extends CharUiTextWithDotsElement {
    constructor(input) {
        super(input);
        const oldPrivate = this.private;

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

        const isEditable = oldPrivate.isEditable;
        const data = oldPrivate.data.data;

        const specialtyWrapper = new ValueWrapper(data, SPECIALTY_FIELD, EMPTY_STRING);

        // Elements
        const specialty = new UITextInput(DEFAULT_INPUT_SIZE);

        if (isEditable) {
            specialty.setOnChangedEvent(() => {
                const specialty = specialty.getValue();
                specialtyWrapper.setValue(specialty);

                // instance.update();
                updateEvent.invoke();
            });
        }

        const priceText = new UIText(EMPTY_STRING, {});
        priceText.setVisible(isEditable);

        this.private = {
            updateEvent: oldPrivate.updateEvent,
            isEditable: oldPrivate.isEditable,
            validations: {
                ...oldPrivate.validations,
            },
            data: {
                ...oldPrivate.data,
                specialtyWrapper,
            },
            elements: {
                ...oldPrivate.elements,
                specialty,
                priceText,
            }
        }
    }

    getSpecialtyElement() {
        return this.private.elements.specialty.getElement();
    }

    getPriceElement() {
        return this.private.elements.priceText.getElement();
    }

    update() {
        const data = this.private.data;
        const elements = this.private.elements;
        const validations = this.private.validations;

        const prevValue = data.dotsWrapper.getPrevValue()
        const value = data.dotsWrapper.getValue(0)
        const totalValue = data.dotsWrapper.getTotalValue(0);

        elements.priceText.setText(`(${this.getPrice()})`);

        const configSpecialtyEditableFrom = validations.part?.specialtyEditableFrom;
        if (!!configSpecialtyEditableFrom) {
            const specialtyEditableFrom = data.info?.specialtyEditableFrom
                ?? configSpecialtyEditableFrom;

            elements.specialty.setVisible(true);
            elements.specialty.setReadOnly(prevValue + value < specialtyEditableFrom);

            if (totalValue >= specialtyEditableFrom) {
                elements.specialty.setValue(data.specialtyWrapper.getValue(EMPTY_STRING));
            } else {
                data.specialtyWrapper.setValue(EMPTY_STRING);
                elements.specialty.setValue(EMPTY_STRING);
            }

            elements.text.setText(data.info.translation);
        } else {
            elements.specialty.setVisible(false);

            const crudeText = data.specialtyWrapper.getValue().trim();
            const text = crudeText.length > 0
                ? `${data.info.translation} (${crudeText})`
                : data.info.translation
            elements.text.setText(text);
        }

        super.update();
    }
}

class CharUiLineDotsSectionElement {
    constructor(input) {
        const {
            data: {
                keeper,
                sectionInfo,
            },
            validations: {
                validations,
                partValidations,
                dataForValidations,
            },
            updateEvent,
        } = input;

        const isEditable = validations?.editable && partValidations?.editable;

        const validationsInfo = { ...dataForValidations, section: sectionInfo.translation, };

        const sectionTitle = sectionInfo.translation ?? EMPTY_STRING;
        const header = new UIText(sectionTitle, {});

        const items = Array.from(sectionInfo?.values ?? []).map(valueInfo => new CharUiLineDotsElement({
            data: {
                keeper,
                valueInfo,
            },
            validations: {
                validations,
                partValidations,
                dataForValidations: validationsInfo,
            },
            updateEvent,
        }));

        const containerBuilder = DTableBuilder.init();

        containerBuilder.addRow().addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .setAttribute(ATTRIBUTES.COLSPAN, 4)
            .appendChilds(header.getElement());

        for (const item of items) {
            const row = containerBuilder.addRow();
            row.addData().appendChilds(item.getTextElement());
            row.addData().appendChilds(item.getSpecialtyElement());
            row.addData().appendChilds(item.getDotsElement());
            row.addData().appendChilds(item.getPriceElement());
        }

        this.private = {
            updateEvent,
            isEditable,
            validations: {
                info: validationsInfo,
                main: validations,
                part: partValidations,
            },
            data: {
                info: sectionInfo,
                sectionTitle,
            },
            elements: {
                header,
                items,
                container: containerBuilder.create(),
            }
        };
    }

    getElement() {
        return this.private.elements.container;
    }

    update() {
        const private = this.private;
        for (const item of private.elements.items) {
            item.update();
        }

        if (private.isEditable) {
            private.elements.header.setText(`${private.data.sectionTitle} (${this.getPrice()})`);
        }
    }

    validate() {
        const errors = this.private.elements.items.flatMap(item => item.validate() ?? []) ?? [];

        this.setHighlight(errors.length > 0);

        return errors;
    }

    setHighlight(isVisible) {
        const container = this.private.elements.container;
        if (isVisible) {
            container.addClass(CSS.BORDER_RED_1);
        } else {
            container.removeClass(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        return this.private.elements.items.reduce((acc, cur) => acc += cur.getPrice(), 0);
    }
}
