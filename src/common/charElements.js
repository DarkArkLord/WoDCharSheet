import { SVGIcons } from './svg.js'
import { ValueWrapper } from './utilities.js'
import { UI_PointsLine, UI_Text, UI_Input_Text, UI_Input_TextOrText, UI_Input_TextOrNumber, UI_Dropdown, UI_Icon_Button, UI_Input_СheckBox, UI_Input_TextOrTextArea, UI_Input_TextArea, UI_Input_Number } from './uiElements.js'
import { DElementBuilder, ATTRIBUTES, EVENTS, ACTIONS, DTableBuilder, DTableRowBuilder } from './domWrapper.js'

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

    setPriceFunc(priceFunc) {
        this.priceFunc = priceFunc;
        this.isDirty = true;
    }
}

const DEFAULT_DOTS_COUNT = 5;
const DEFAULT_INPUT_SIZE = 10;
const DEFAULT_TEXT_AREA_COLS = 30;
const DEFAULT_TEXT_AREA_ROWS = 2;
const EMPTY_STRING = '';

const DEFAULT_COMPARATOR = (a, b) => b - a;

const SPECIALTY_FIELD = 'specialty'
const TEXT_FIELD = 'text';
const TYPE_FIELD = 'type';
const ALT_PRICE_FIELD = 'useAltPrice';
const CUSTOM_ITEMS_FIELD = 'customItems';

class CharUi_Element_Dots {
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

        const hasAltPrice = !!dotsInputValidations?.altPrice;
        const useAltPriceWrapper = new ValueWrapper(data, ALT_PRICE_FIELD, false);
        const priceWrapper = new DotsValuePriceWrapper(
            wrapper,
            hasAltPrice && useAltPriceWrapper.getValue()
                ? dotsInputValidations.altPrice
                : dotsInputValidations?.price,
        );

        // Elements
        const altPriceCheckBox = new UI_Input_СheckBox();
        altPriceCheckBox.setVisible(dotsInputValidations.showAltPrice);

        const isAltPriceCheckBoxEditable = isEditable && dotsInputValidations.editableAltPrice;
        altPriceCheckBox.setReadOnly(!isAltPriceCheckBoxEditable);

        if (isAltPriceCheckBoxEditable) {
            altPriceCheckBox.setOnInputEvent(() => {
                const flag = altPriceCheckBox.getValue();
                useAltPriceWrapper.setValue(flag);

                updateEvent.invoke();
            });
        }

        const dots = new UI_PointsLine(dotsCount, isEditable);
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

        this.inner = {
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
                hasAltPrice,
                useAltPriceWrapper,
                priceWrapper,
            },
            elements: {
                altPriceCheckBox,
                dots,
                subButton,
                addButton,
            },
        };
    }

    getAltPriceElement() {
        return this.inner.elements.altPriceCheckBox.getElement();
    }
    getDotsElement() {
        return this.inner.elements.dots.getElement();
    }

    update() {
        const data = this.inner.data;
        const dotsInfo = this.inner.validations.dots;
        const wrapper = data.wrapper;
        const elements = this.inner.elements;

        const useAltPrice = data.useAltPriceWrapper.getValue();
        elements.altPriceCheckBox.setValue(useAltPrice);

        if (data.hasAltPrice) {
            data.priceWrapper.setPriceFunc(
                useAltPrice ? dotsInfo.altPrice : dotsInfo.price
            );
        }

        if (this.inner.isEditable) {
            const prevValue = wrapper.getPrevValue();
            const value = wrapper.getValue(0);
            const hasNextValue = wrapper.hasNextValue();

            elements.dots.setValue(prevValue, value);

            const validations = this.inner.validations;

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

        const wrapper = this.inner.data.wrapper;
        const validations = this.inner.validations;
        const totalValue = wrapper.getPrevValue() + wrapper.getValue(0);
        if (totalValue < validations.dots?.totalMin) {
            errors.push({
                ...validations.info,
                text: `Не может быть меньше ${validations.dots?.totalMin} (сейчас ${totalValue})`,
            });
        }
        if (totalValue > validations.dots?.totalMax) {
            errors.push({
                ...validations.info,
                text: `Не может быть больше ${validations.dots?.totalMax} (сейчас ${totalValue})`,
            });
        }

        return errors;
    }

    getPrice() {
        return this.inner.data.priceWrapper.getPrice();
    }
}

class CharUi_Element_TextWithDots {
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
        const text = new UI_Text(valueInfo.translation, {});
        const dots = new CharUi_Element_Dots({
            data,
            validations: {
                validations,
                partValidations,
                dataForValidations: validationsInfo,
            },
            updateEvent,
        });

        this.inner = {
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
                dotsWrapper: dots.inner.data.wrapper,
                priceWrapper: dots.inner.data.priceWrapper,
            },
            elements: {
                text,
                dots,
            }
        };
    }

    getAltPriceElement() {
        return this.inner.elements.dots.getAltPriceElement();
    }
    getTextElement() {
        return this.inner.elements.text.getElement();
    }
    getDotsElement() {
        return this.inner.elements.dots.getDotsElement();
    }

    update() {
        this.inner.elements.dots.update();
    }

    validate() {
        const errors = this.inner.elements.dots.validate() ?? [];

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
        return this.inner.elements.dots.getPrice();
    }
}

class CharUi_Element_LineDots extends CharUi_Element_TextWithDots {
    constructor(input) {
        super(input);
        const oldinner = this.inner;

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

        const isEditable = oldinner.isEditable;
        const data = oldinner.data.data;

        const specialtyWrapper = new ValueWrapper(data, SPECIALTY_FIELD, EMPTY_STRING);

        // Elements
        const specialty = new UI_Input_Text(DEFAULT_INPUT_SIZE);

        if (isEditable) {
            specialty.setOnInputEvent(() => {
                const text = specialty.getValue();
                specialtyWrapper.setValue(text);

                updateEvent.invoke();
            });
        }

        const priceText = new UI_Text(EMPTY_STRING, {});
        priceText.setVisible(isEditable);

        this.inner = {
            updateEvent: oldinner.updateEvent,
            isEditable: oldinner.isEditable,
            validations: {
                ...oldinner.validations,
            },
            data: {
                ...oldinner.data,
                specialtyWrapper,
            },
            elements: {
                ...oldinner.elements,
                specialty,
                priceText,
            }
        };
    }

    getSpecialtyElement() {
        return this.inner.elements.specialty.getElement();
    }

    getPriceElement() {
        return this.inner.elements.priceText.getElement();
    }

    update() {
        super.update();

        const data = this.inner.data;
        const elements = this.inner.elements;
        const validations = this.inner.validations;

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
            elements.specialty.setReadOnly(true);
            elements.specialty.setActive(false);
            elements.specialty.setValue(data.specialtyWrapper.getValue(EMPTY_STRING));
        }
    }
}

class CharUi_Section_LineDots {
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
        const header = new UI_Text(sectionTitle, {});

        const items = Array.from(sectionInfo?.values ?? []).map(valueInfo => new CharUi_Element_LineDots({
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
        const columnsCount = 5;

        containerBuilder.addRow().addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .setAttribute(ATTRIBUTES.COLSPAN, columnsCount)
            .appendChilds(header.getElement());

        for (const item of items) {
            const row = containerBuilder.addRow();
            row.addData().appendChilds(item.getAltPriceElement());
            row.addData().appendChilds(item.getTextElement());
            row.addData().appendChilds(item.getSpecialtyElement());
            row.addData().appendChilds(item.getDotsElement());
            row.addData().appendChilds(item.getPriceElement());
        }

        const hasCustomItems = !!sectionInfo.variants;
        let customItems = undefined;

        if (hasCustomItems) {
            const customItemsData = keeper[CUSTOM_ITEMS_FIELD] = keeper[CUSTOM_ITEMS_FIELD] ?? {};

            customItems = new CharUi_Element_LineInputDotsWithVariantsList({
                data: {
                    keeper: customItemsData,
                    valueInfo: sectionInfo,
                    showHeader: false,
                },
                validations: {
                    validations,
                    partValidations,
                    dataForValidations: validationsInfo,
                },
                updateEvent: updateEvent,
            })

            containerBuilder.addRow().addData()
                .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
                .setAttribute(ATTRIBUTES.COLSPAN, columnsCount)
                .appendChilds(customItems.getElement());
        }

        this.inner = {
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
                customItems,
                container: containerBuilder.create(),
            }
        };
    }

    getElement() {
        return this.inner.elements.container;
    }

    update() {
        const inner = this.inner;
        for (const item of inner.elements.items) {
            item.update();
        }

        inner.elements.customItems?.update();

        if (inner.isEditable) {
            inner.elements.header.setText(`${inner.data.sectionTitle} (${this.getPrice()})`);
        }
    }

    validate() {
        const elements = this.inner.elements;
        const errors = [
            ...(elements.items.flatMap(item => item.validate() ?? []) ?? []),
            ...(elements.customItems?.validate() ?? []),
        ];

        this.setHighlight(errors.length > 0);

        return errors;
    }

    setHighlight(isVisible) {
        const container = this.inner.elements.container;
        if (isVisible) {
            container.addClass(CSS.BORDER_RED_1);
        } else {
            container.removeClass(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        const elements = this.inner.elements;
        const itemsPrice = elements.items?.reduce((acc, cur) => acc += cur.getPrice(), 0) ?? 0;
        const customItemsPrice = elements.customItems?.getPrice() ?? 0;
        return itemsPrice + customItemsPrice;
    }
}

export class CharUi_Part_LineDots {
    constructor(input) {
        const {
            data: {
                keeper,
                partInfo,
            },
            validations: {
                validations,
                dataForValidations,
            },
            updateEvent,
        } = input;

        const partValidations = validations?.[partInfo.id];
        const isEditable = validations?.editable && partValidations?.editable;

        const validationsInfo = { ...dataForValidations, part: partInfo.translation, };

        const data = keeper[partInfo.id] = keeper[partInfo.id] ?? {};

        const partTitle = partInfo.translation ?? EMPTY_STRING;
        const header = new UI_Text(partTitle, {});

        const sections = Array.from(partInfo.sections ?? []).map(section => new CharUi_Section_LineDots({
            data: {
                keeper: data,
                sectionInfo: section,
            },
            validations: {
                validations,
                partValidations: partValidations,
                dataForValidations: validationsInfo,
            },
            updateEvent,
        })) ?? [];

        const containerBuilder = DTableBuilder.init();

        containerBuilder.addRow().addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .setAttribute(ATTRIBUTES.COLSPAN, partInfo.sections.length)
            .appendChilds(header.getElement());

        const sectionsRow = containerBuilder.addRow();
        for (const section of sections) {
            sectionsRow.addData().appendChilds(section.getElement());
        }

        this.inner = {
            updateEvent,
            isEditable,
            validations: {
                info: validationsInfo,
                main: validations,
                part: partValidations,
            },
            data: {
                info: partInfo,
                data,
                partTitle,
            },
            elements: {
                header,
                sections,
                container: containerBuilder.create(),
            }
        };
    }

    getElement() {
        return this.inner.elements.container;
    }

    update() {
        const inner = this.inner;
        for (const section of inner.elements.sections) {
            section.update();
        }

        if (inner.isEditable) {
            inner.elements.header.setText(`${this.inner.data.partTitle} (${this.getPrice()})`);
        }
    }

    validate() {
        const sections = this.inner.elements.sections;
        const validations = this.inner.validations
        const errors = sections.flatMap(item => item.validate() ?? []) ?? [];

        if (validations.part?.sectionPoints) {
            const validPoints = validations.part.sectionPoints.slice().sort(DEFAULT_COMPARATOR);
            const currentPoints = sections.map(section => section.getPrice()).sort(DEFAULT_COMPARATOR);

            if (JSON.stringify(validPoints) !== JSON.stringify(currentPoints)) {
                const validPointsStr = validPoints.join('/');
                const currentPointsStr = currentPoints.join('/');
                errors.push({
                    ...validations.info,
                    text: `Между секциями должно быть распределено ${validPointsStr} точек (сейчас ${currentPointsStr})`,
                });
            }
        }

        if (validations.part?.freePoints !== undefined) {
            const price = this.getPrice();

            if (price !== validations.part.freePoints) {
                errors.push({
                    ...validations.info,
                    text: `Должно быть распределено ${validations.part.freePoints} точек (сейчас ${price})`,
                });
            }
        }

        this.setHighlight(errors.length > 0);

        return errors;
    }

    setHighlight(isVisible) {
        const container = this.inner.elements.container;
        if (isVisible) {
            container.addClass(CSS.BORDER_RED_1);
        } else {
            container.removeClass(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        return this.inner.elements.sections.reduce((acc, cur) => acc += cur.getPrice(), 0);
    }
}

export class CharUi_Element_BlockDots extends CharUi_Element_TextWithDots {
    constructor(input) {
        super(input);
        const oldinner = this.inner;

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

        const containerBuilder = DTableBuilder.init();

        containerBuilder.addRow().addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .appendChilds(this.getTextElement());

        containerBuilder.addRow().addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .appendChilds(this.getDotsElement());

        this.inner = {
            updateEvent: oldinner.updateEvent,
            isEditable: oldinner.isEditable,
            validations: {
                ...oldinner.validations,
            },
            data: {
                ...oldinner.data,
            },
            elements: {
                ...oldinner.elements,
                container: containerBuilder.create(),
            }
        };
    }

    getElement() {
        return this.inner.elements.container;
    }

    update() {
        const inner = this.inner;
        if (inner.isEditable) {
            inner.elements.text.setText(`${inner.data.info.translation} (${this.getPrice()})`)
        }

        super.update();
    }

    setHighlight(isVisible) {
        const container = this.inner.elements.container;
        if (isVisible) {
            container.addClass(CSS.BORDER_RED_1);
        } else {
            container.removeClass(CSS.BORDER_RED_1);
        }
    }
}

class CharUi_Element_BaseTextOrInput_OLD {
    constructor(input, ElementConstructor = UI_Input_TextOrText) {
        const {
            data: {
                data,
                fieldName,
                defaultValue,
            } = {},
            inputConfig = {},
            isEditable = false,
            updateEvent,
        } = input;

        const wrapper = new ValueWrapper(data, fieldName, defaultValue);

        const element = new ElementConstructor(isEditable, inputConfig);
        if (isEditable) {
            element.setOnInputEvent(() => {
                const value = element.getValue();
                wrapper.setValue(value);
                updateEvent.invoke();
            });
        }

        this.inner = {
            updateEvent,
            isEditable,
            wrapper,
            element,
        };
    }

    getElement() {
        return this.inner.element.getElement();
    }

    getValue() {
        return this.inner.wrapper.getValue();
    }

    setValue(text) {
        this.inner.wrapper.setValue(text);
        this.inner.element.setValue(text);
    }

    update() {
        this.setValue(this.getValue());
    }
}

class CharUi_Element_BaseInput {
    constructor(input, InputElementConstructor = UI_Input_Text) {
        const {
            data: {
                data,
                fieldName,
                defaultValue,
            } = {},
            inputConfig = {},
            isEditable = false,
            updateEvent,
        } = input;

        const wrapper = new ValueWrapper(data, fieldName, defaultValue);

        const element = new InputElementConstructor(inputConfig);

        element.setReadOnly(!isEditable);
        element.setActive(isEditable);

        if (isEditable) {
            element.setOnInputEvent(() => {
                const value = element.getValue();
                wrapper.setValue(value);
                updateEvent.invoke();
            });
        }

        this.inner = {
            updateEvent,
            isEditable,
            wrapper,
            element,
        };
    }

    getElement() {
        return this.inner.element.getElement();
    }

    getValue() {
        return this.inner.wrapper.getValue();
    }

    setValue(text) {
        this.inner.wrapper.setValue(text);
        this.inner.element.setValue(text);
    }

    update() {
        this.setValue(this.getValue());
    }
}

class CharUi_Element_TextOrInput extends CharUi_Element_BaseTextOrInput_OLD {
    constructor(input) {
        const {
            data: {
                data,
                fieldName,
                defaultValue = EMPTY_STRING,
            } = {},
            inputConfig: {
                size = DEFAULT_INPUT_SIZE,
            } = {},
            isEditable = false,
            updateEvent,
        } = input;

        super({
            data: { data, fieldName, defaultValue, },
            inputConfig: { size, },
            isEditable,
            updateEvent,
        }, UI_Input_TextOrText);
    }
}

class CharUi_Item_LineInputDotsWithVariants {
    constructor(input) {
        const {
            data: {
                data,
                defaultOptions,
            },
            validations: {
                validations,
                partValidations,
                dataForValidations,
            },
            updateEvent,
        } = input;

        const isEditable = validations?.editable && partValidations?.editable;
        const validationsInfo = { ...dataForValidations, commonValue: EMPTY_STRING };

        // Elements
        const removeButton = new UI_Icon_Button(SVGIcons.BUTTON_SUB_ENABLED, SVGIcons.BUTTON_SUB_DISABLED);
        removeButton.setVisible(isEditable);

        const text = new CharUi_Element_TextOrInput({
            data: {
                data,
                fieldName: TEXT_FIELD,
            },
            isEditable,
            updateEvent,
        });

        const variants = new UI_Dropdown({ selectAttrubutes: { class: CSS.DROPDOWN_AS_BUTTON }, addEmptyOption: true, defaultOptions });
        variants.setVisible(isEditable);
        if (isEditable) {
            variants.setOnChangeEvent(eventInput => {
                const value = eventInput.target.value;
                eventInput.target.selectedIndex = 0;

                text.setValue(value);
                updateEvent.invoke();
            });
        }

        const dots = new CharUi_Element_Dots({
            data,
            validations: {
                validations,
                partValidations,
                dataForValidations: validationsInfo,
            },
            updateEvent,
        });

        const price = new UI_Text(EMPTY_STRING, {});
        price.setVisible(isEditable);

        this.inner = {
            updateEvent,
            isEditable,
            validations: {
                info: validationsInfo,
                main: validations,
                part: partValidations,
            },
            data,
            elements: {
                removeButton,
                text,
                variants,
                dots,
                price,
            },
        };
    }

    getRemoveButton() {
        return this.inner.elements.removeButton;
    }

    getRemoveButtonElement() {
        return this.inner.elements.removeButton.getElement();
    }

    getTextElement() {
        return this.inner.elements.text.getElement();
    }

    getVariantsElement() {
        return this.inner.elements.variants.getElement();
    }

    getDotsElement() {
        return this.inner.elements.dots.getDotsElement();
    }

    getPriceElement() {
        return this.inner.elements.price.getElement();
    }

    update() {
        const elements = this.inner.elements;

        elements.text.update();
        elements.dots.update();

        elements.price.setText(`(${this.getPrice()})`);

        const dotsWrapper = elements.dots.inner.data.wrapper;
        const hasPrevValue = dotsWrapper.hasPrevValue();
        const hasNextValue = dotsWrapper.hasNextValue();
        elements.removeButton.setActive(!hasPrevValue && !hasNextValue);

        const validationsInfo = this.inner.validations.info;
        validationsInfo.commonValue = elements.text.getValue();
    }

    validate() {
        const elements = this.inner.elements;
        const errors = elements.dots.validate() ?? [];

        this.setDotsHighlight(errors.length > 0);

        const text = elements.text.getValue().trim();
        if (this.inner.isEditable && text.length < 1) {
            errors.push({
                ...this.inner.validations.info,
                text: `Необходимо заполнит текст`,
            });

            this.setTextHighlight(true);
        } else {
            this.setTextHighlight(false);
        }

        return errors;
    }

    setTextHighlight(isVisible) {
        const element = this.inner.elements.text;
        if (isVisible) {
            element.getElement().addClass(CSS.BORDER_RED_1);
        } else {
            element.getElement().removeClass(CSS.BORDER_RED_1);
        }
    }

    setDotsHighlight(isVisible) {
        const element = this.inner.elements.dots;
        if (isVisible) {
            element.getDotsElement().addClass(CSS.BORDER_RED_1);
        } else {
            element.getDotsElement().removeClass(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        return this.inner.elements.dots.getPrice();
    }
}

export class CharUi_Element_LineInputDotsWithVariantsList {
    constructor(input) {
        const {
            data: {
                keeper,
                valueInfo,
                showHeader,
            },
            validations: {
                validations,
                partValidations,
                dataForValidations,
            },
            updateEvent,
        } = input;

        this.info = valueInfo;

        const isEditable = validations?.editable && partValidations?.editable;
        const validationsInfo = { ...dataForValidations, value: valueInfo.translation, };
        const data = keeper[valueInfo.id] = keeper[valueInfo.id] ?? [];

        const dropDownOptions = Array.from(valueInfo.variants ?? []).map(variant => ({
            text: variant.translation,
            attrubutes: {},
        }));

        // Elements
        const COLS_IN_ROW = 5;

        let header, headerRow;
        if (showHeader) {
            header = new UI_Text(valueInfo.translation, {});
            headerRow = DElementBuilder.initTableRow()
                .appendChilds(
                    DElementBuilder.initTableData()
                        .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
                        .setAttribute(ATTRIBUTES.COLSPAN, COLS_IN_ROW)
                        .appendChilds(header.getElement())
                        .create()
                ).create();
        }

        const addButton = new UI_Icon_Button(SVGIcons.BUTTON_ADD_ENABLED, SVGIcons.BUTTON_ADD_DISABLED);
        addButton.setVisible(isEditable);
        if (isEditable) {
            addButton.setOnClickEvent(() => {
                data.push({});
                updateEvent.invoke();
            });
        }

        const addButtonRow = DElementBuilder.initTableRow()
            .appendChilds(
                DElementBuilder.initTableData()
                    .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
                    .setAttribute(ATTRIBUTES.COLSPAN, COLS_IN_ROW)
                    .appendChilds(addButton.getElement())
                    .create()
            ).create();

        const container = DElementBuilder.initTable().create();

        this.inner = {
            updateEvent,
            isEditable,
            showHeader,
            validations: {
                info: validationsInfo,
                main: validations,
                part: partValidations,
            },
            data: {
                data,
                info: valueInfo,
                dropDownOptions,
            },
            elements: {
                header,
                headerRow,
                items: [],
                addButton,
                addButtonRow,
                container,
            },
        };

        this.refreshItems();
    }

    getElement() {
        return this.inner.elements.container;
    }

    createItemWrapper(itemData) {
        const inner = this.inner;

        const item = new CharUi_Item_LineInputDotsWithVariants({
            data: {
                data: itemData,
                defaultOptions: inner.data.dropDownOptions,
            },
            validations: {
                validations: inner.validations.main,
                partValidations: inner.validations.part,
                dataForValidations: inner.validations.info,
            },
            updateEvent: inner.updateEvent,
        });

        const listData = inner.data.data;
        item.getRemoveButton().setOnClickEvent(() => {
            const dataIndex = listData.findIndex(value => value === itemData);
            if (dataIndex >= 0) {
                listData.splice(dataIndex, 1);
                inner.updateEvent.invoke();
            }
        });

        return item;
    }

    refreshItems() {
        const inner = this.inner;
        const items = inner.elements.items = [];

        const container = inner.elements.container;
        container.setText(EMPTY_STRING);

        if (inner.showHeader) {
            container.appendChilds(inner.elements.headerRow);
        }

        for (const itemData of this.inner.data.data) {
            const item = this.createItemWrapper(itemData);

            items.push(item);

            const rowBuilder = DTableRowBuilder.init();

            rowBuilder.addData().appendChilds(item.getRemoveButtonElement());
            rowBuilder.addData().appendChilds(item.getTextElement());
            rowBuilder.addData().appendChilds(item.getVariantsElement());
            rowBuilder.addData().appendChilds(item.getDotsElement());
            rowBuilder.addData().appendChilds(item.getPriceElement());

            container.appendChilds(rowBuilder.create());
        }

        if (inner.isEditable) {
            container.appendChilds(inner.elements.addButtonRow);
        }
    }

    update() {
        const inner = this.inner;
        if (inner.elements.items.length !== inner.data.data.length) {
            this.refreshItems();
        }

        for (const item of inner.elements.items) {
            item.update();
        }

        if (inner.isEditable && inner.showHeader) {
            inner.elements.header.setText(`${inner.data.info.translation} (${this.getPrice()})`);
        }
    }

    validate() {
        const inner = this.inner;
        const errors = inner.elements.items.flatMap(item => item.validate() ?? []) ?? [];

        if (inner.validations.part?.freePoints !== undefined) {
            const price = this.getPrice();

            if (price !== inner.validations.part.freePoints) {
                errors.push({
                    ...this.validationsInfo,
                    text: `Должно быть распределено ${inner.validations.part.freePoints} точек (сейчас ${price})`,
                });
            }
        }

        this.setHighlight(errors.length > 0);

        return errors;
    }

    setHighlight(isVisible) {
        const container = this.inner.elements.container;
        if (isVisible) {
            container.addClass(CSS.BORDER_RED_1);
        } else {
            container.removeClass(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        return this.inner.elements.items.reduce((acc, cur) => acc += cur.getPrice(), 0);
    }
}

class CharUi_Element_PointsByState {
    constructor(input) {
        const {
            data: {
                data,
                inputStyle,
            },
            validations: {
                validations,
                partValidations,
            },
            updateEvent,
        } = input;

        const pointsInputValidations = partValidations?.pointsInput;
        const isEditable = validations?.editable && partValidations?.editable;

        const wrapper = new ValueByStateWrapper(
            data,
            validations?.state,
            pointsInputValidations?.min ?? 0,
            validations?.prev,
            validations?.next,
        );

        const prevValueText = new UI_Text(EMPTY_STRING, {});
        const points = new CharUi_Element_BaseInput({
            data: {
                data,
                fieldName: validations?.state,
                defaultValue: pointsInputValidations?.min ?? 0,
            },
            inputConfig: {
                min: pointsInputValidations?.min ?? 0,
                inputStyle,
            },
            isEditable,
            updateEvent,
        }, UI_Input_Number);
        const nextValueText = new UI_Text(EMPTY_STRING, {});

        const containerBuilder = DTableBuilder.init();
        const rowBuilder = containerBuilder.addRow();
        rowBuilder.addData().appendChilds(prevValueText.getElement());
        rowBuilder.addData().appendChilds(points.getElement());
        rowBuilder.addData().appendChilds(nextValueText.getElement());

        const totalText = new UI_Text(EMPTY_STRING, {});

        this.inner = {
            updateEvent,
            isEditable,
            validations: {
                main: validations,
                part: partValidations,
            },
            data: {
                data,
                wrapper,
            },
            elements: {
                prevValueText,
                points,
                nextValueText,
                container: containerBuilder.create(),
                totalText,
            },
        };
    }

    getElement() {
        const elements = this.inner.elements;

        if (this.inner.isEditable) {
            return elements.container;
        }

        return elements.totalText.getElement();
    }

    update() {
        const elements = this.inner.elements;
        const wrapper = this.inner.data.wrapper;

        elements.prevValueText.setText(`${wrapper.getPrevValue()} /`);
        elements.points.update();
        elements.nextValueText.setText(`/ ${wrapper.getNextValue()}`);
        elements.totalText.setText(wrapper.getTotalValue(0));
    }

    getValue() {
        return this.inner.elements.points.getValue();
    }

    setValue(value) {
        this.inner.elements.points.setValue(value);
    }
}

class CharUi_Item_LineInputPointsWithVariants {
    constructor(input) {
        const {
            data: {
                data,
                defaultOptions,
            },
            validations: {
                validations,
                partValidations,
                dataForValidations,
            },
            updateEvent,
        } = input;

        const isEditable = validations?.editable && partValidations?.editable;
        const validationsInfo = { ...dataForValidations, commonValue: EMPTY_STRING };

        // Elements
        const removeButton = new UI_Icon_Button(SVGIcons.BUTTON_SUB_ENABLED, SVGIcons.BUTTON_SUB_DISABLED);
        removeButton.setVisible(this.isEditable);

        const text = new CharUi_Element_TextOrInput({
            data: {
                data,
                fieldName: TEXT_FIELD,
            },
            isEditable,
            updateEvent,
        });

        const type = new CharUi_Element_TextOrInput({
            data: {
                data,
                fieldName: TYPE_FIELD,
            },
            inputConfig: {
                size: 4,
            },
            isEditable,
            updateEvent,
        });

        const points = new CharUi_Element_PointsByState({
            data: {
                data,
                inputStyle: 'width: 50px',
            },
            validations: {
                validations,
                partValidations,
            },
            updateEvent,
        });
        debugger;
        const variants = new UI_Dropdown({ selectAttrubutes: { class: CSS.DROPDOWN_AS_BUTTON }, addEmptyOption: true, defaultOptions });
        variants.setVisible(isEditable);
        if (isEditable) {
            variants.setOnChangeEvent(eventInput => {
                const value = JSON.parse(eventInput.target.value);
                eventInput.target.selectedIndex = 0;

                text.setValue(value.text);
                type.setValue(value.type);
                points.setValue(value.cost);

                updateEvent.invoke();
            });
        }

        this.inner = {
            updateEvent,
            isEditable,
            validations: {
                info: validationsInfo,
                main: validations,
                part: partValidations,
            },
            data,
            elements: {
                removeButton,
                text,
                type,
                points,
                variants,
            },
        };
    }

    getRemoveButton() {
        return this.inner.elements.removeButton;
    }

    getRemoveButtonElement() {
        return this.inner.elements.removeButton.getElement();
    }

    getTextElement() {
        return this.inner.elements.text.getElement();
    }

    getTypeElement() {
        return this.inner.elements.type.getElement();
    }

    getPointsElement() {
        return this.inner.elements.points.getElement();
    }

    getVariantsElement() {
        return this.inner.elements.variants.getElement();
    }

    update() {
        const elements = this.inner.elements;

        elements.text.update();
        elements.type.update();
        elements.points.update();

        const pointsWrapper = elements.points.inner.data.wrapper;
        const hasPrevValue = pointsWrapper.hasPrevValue();
        const hasNextValue = pointsWrapper.hasNextValue();
        elements.removeButton.setActive(!hasPrevValue && !hasNextValue);

        this.inner.validations.info.commonValue = elements.text.getValue();
    }

    validate() {
        const elements = this.inner.elements;
        const isEditable = this.inner.isEditable;
        const errors = [];

        const text = elements.text.getValue();
        if (isEditable && text.length < 1) {
            errors.push({
                ...this.inner.validations.info,
                text: `Необходимо заполнит текст`,
            });

            this.setTextHighlight(true);
        } else {
            this.setTextHighlight(false);
        }

        const type = elements.type.getValue();
        if (isEditable && type.length < 1) {
            errors.push({
                ...this.inner.validations.info,
                text: `Необходимо заполнит тип`,
            });

            this.setTypeHighlight(true);
        } else {
            this.setTypeHighlight(false);
        }

        const points = elements.points.getValue();
        if (isEditable && (points === undefined || points === EMPTY_STRING)) {
            errors.push({
                ...this.inner.validations.info,
                text: `Необходимо заполнить стоимость`,
            });

            this.setPointsHighlight(true);
        } else if (isEditable && Number.isNaN(+points)) {
            errors.push({
                ...this.inner.validations.info,
                text: `Необходимо стоимость должна быть число`,
            });

            this.setPointsHighlight(true);
        } else {
            this.setPointsHighlight(false);
        }

        return errors;
    }

    setTextHighlight(isVisible) {
        const element = this.inner.elements.text.getElement();
        if (isVisible) {
            element.addClass(CSS.BORDER_RED_1);
        } else {
            element.removeClass(CSS.BORDER_RED_1);
        }
    }

    setTypeHighlight(isVisible) {
        const element = this.inner.elements.type.getElement();
        if (isVisible) {
            element.addClass(CSS.BORDER_RED_1);
        } else {
            element.removeClass(CSS.BORDER_RED_1);
        }
    }


    setPointsHighlight(isVisible) {
        const element = this.inner.elements.points.getElement();
        if (isVisible) {
            element.addClass(CSS.BORDER_RED_1);
        } else {
            element.removeClass(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        const price = +this.inner.elements.points.getValue();
        return Number.isNaN(price) ? 0 : price;
    }
}

export class CharUi_Element_LineInputPointsWithVariantsList {
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

        const listInputValidations = partValidations?.listInput;
        const pointsInputValidations = partValidations?.pointsInput;
        const isEditable = validations?.editable && partValidations?.editable;

        const validationsInfo = { ...dataForValidations, value: valueInfo.translation, };

        const data = keeper[valueInfo.id] = keeper[valueInfo.id] ?? [];

        const dropDownOptions = (valueInfo.variants ?? []).flatMap(variant =>
            variant.points.map(cost => ({
                text: `${variant.translation} (${variant.type}, ${cost} оч)`,
                attrubutes: {
                    value: JSON.stringify({
                        text: variant.translation,
                        type: variant.type,
                        cost,
                    })
                },
            })));

        // Elements
        const COLS_IN_ROW = 5;

        const header = new UI_Text(valueInfo.translation, {});
        const headerRow = DElementBuilder.initTableRow()
            .appendChilds(
                DElementBuilder.initTableData()
                    .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
                    .setAttribute(ATTRIBUTES.COLSPAN, COLS_IN_ROW)
                    .appendChilds(header.getElement())
                    .create()
            ).create();

        const addButton = new UI_Icon_Button(SVGIcons.BUTTON_ADD_ENABLED, SVGIcons.BUTTON_ADD_DISABLED);
        addButton.setVisible(isEditable);
        if (isEditable) {
            addButton.setOnClickEvent(() => {
                data.push({});
                updateEvent.invoke();
            });
        }

        const addButtonRow = DElementBuilder.initTableRow()
            .appendChilds(
                DElementBuilder.initTableData()
                    .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
                    .setAttribute(ATTRIBUTES.COLSPAN, COLS_IN_ROW)
                    .appendChilds(addButton.getElement())
                    .create()
            ).create();

        const container = DElementBuilder.initTable().create();

        this.inner = {
            updateEvent,
            isEditable,
            validations: {
                info: validationsInfo,
                main: validations,
                part: partValidations,
                list: listInputValidations,
                points: pointsInputValidations,
            },
            data: {
                data,
                info: valueInfo,
                dropDownOptions,
            },
            elements: {
                header,
                headerRow,
                items: [],
                addButton,
                addButtonRow,
                container,
            },
        };

        this.refreshItems();
    }

    getElement() {
        return this.inner.elements.container;
    }

    createItemWrapper(itemData) {
        const inner = this.inner;
        const item = new CharUi_Item_LineInputPointsWithVariants({
            data: {
                data: itemData,
                defaultOptions: inner.data.dropDownOptions,
            },
            validations: {
                validations: inner.validations.main,
                partValidations: inner.validations.part,
                dataForValidations: inner.validations.info,
            },
            updateEvent: inner.updateEvent,
        });

        const listData = inner.data.data;
        item.getRemoveButton().setOnClickEvent(() => {
            const dataIndex = listData.findIndex(value => value === itemData);
            if (dataIndex >= 0) {
                listData.splice(dataIndex, 1);
                inner.updateEvent.invoke();
            }
        });

        return item;
    }

    refreshItems() {
        const inner = this.inner;
        const items = inner.elements.items = [];

        const container = inner.elements.container;
        container.setText(EMPTY_STRING);

        container.appendChilds(inner.elements.headerRow);

        for (const itemData of this.inner.data.data) {
            const item = this.createItemWrapper(itemData);

            items.push(item);

            const rowBuilder = DTableRowBuilder.init();

            rowBuilder.addData().appendChilds(item.getRemoveButtonElement());
            rowBuilder.addData().appendChilds(item.getTextElement());
            rowBuilder.addData().appendChilds(item.getTypeElement());
            rowBuilder.addData().appendChilds(item.getVariantsElement());
            rowBuilder.addData().appendChilds(item.getPointsElement());

            container.appendChilds(rowBuilder.create());
        }

        if (inner.isEditable) {
            container.appendChilds(inner.elements.addButtonRow);
        }
    }

    update() {
        const inner = this.inner;
        if (inner.elements.items.length !== inner.data.data.length) {
            this.refreshItems();
        }

        for (const item of inner.elements.items) {
            item.update();
        }

        if (inner.isEditable) {
            inner.elements.header.setText(`${inner.data.info.translation} (${this.getPrice()})`);
        }
    }

    validate() {
        const items = this.inner.elements.items;
        const validations = this.inner.validations;
        const errors = items.flatMap(item => item.validate() ?? []) ?? [];

        const totalPrice = items.reduce((acc, cur) => acc + cur.getPrice(0), 0);
        if (totalPrice > validations.list?.maxPointsSum) {
            errors.push({
                ...validations.info,
                text: `Набрано больше ${validations.list?.maxPointsSum} очков (сейчас ${totalPrice})`,
            });
        }

        this.setHighlight(errors.length > 0);

        return errors;
    }

    setHighlight(isVisible) {
        const element = this.inner.elements.container;
        if (isVisible) {
            element.addClass(CSS.BORDER_RED_1);
        } else {
            element.removeClass(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        const inner = this.inner;
        const price = inner.elements.items.reduce((acc, cur) => acc += cur.getPrice(), 0);
        return inner.validations.points?.negativePrice ? -price : price;
    }
}

export class CharUi_Element_BlockPoints {
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

        const pointsInputValidations = partValidations?.pointsInput;
        const isEditable = validations?.editable && partValidations?.editable;

        const validationsInfo = { ...dataForValidations, value: valueInfo.translation, };

        // Elements
        const text = new UI_Text(valueInfo.translation, {});
        const points = new CharUi_Element_BaseInput({
            data: {
                data: keeper,
                fieldName: valueInfo.id,
                defaultValue: pointsInputValidations?.min ?? 0,
            },
            inputConfig: {
                min: pointsInputValidations?.min ?? 0,
                inputStyle: 'width: 100px',
            },
            isEditable,
            updateEvent,
        }, UI_Input_Number);

        const containerBuilder = DTableBuilder.init();
        containerBuilder.addRow().addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .appendChilds(text.getElement());
        containerBuilder.addRow().addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .appendChilds(points.getElement());

        this.inner = {
            updateEvent,
            isEditable,
            validations: {
                info: validationsInfo,
                main: validations,
                part: partValidations,
                points: pointsInputValidations,
            },
            data: {
                data: keeper,
                info: valueInfo,
            },
            elements: {
                text,
                points,
                container: containerBuilder.create(),
            },
        };
    }

    getElement() {
        return this.inner.elements.container;
    }

    update() {
        this.inner.elements.points.update();
    }

    validate() {
        return [];
    }

    getPrice() {
        return 0;
    }
}

class CharUi_Element_TextArea {
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

        // Elements
        const text = new UI_Text(valueInfo.translation, {});
        const inputElement = new CharUi_Element_BaseInput({
            data: {
                data: keeper,
                fieldName: valueInfo.id,
                defaultValue: EMPTY_STRING,
            },
            inputConfig: {
                cols: DEFAULT_TEXT_AREA_COLS,
                rows: DEFAULT_TEXT_AREA_ROWS,
            },
            isEditable,
            updateEvent,
        }, UI_Input_TextArea);

        this.inner = {
            updateEvent,
            isEditable,
            validations: {
                info: validationsInfo,
                main: validations,
                part: partValidations,
            },
            data: {
                info: valueInfo,
                data: keeper,
            },
            elements: {
                text,
                input: inputElement,
            }
        };
    }

    getTextElement() {
        return this.inner.elements.text.getElement();
    }
    getInputElement() {
        return this.inner.elements.input.getElement();
    }

    update() {
        this.inner.elements.input.update();
    }

    validate() {
        return [];
    }

    setHighlight(isVisible) {
        const text = this.getTextElement();
        const input = this.getInputElement();

        if (isVisible) {
            text.addClass(CSS.BORDER_RED_1);
            input.addClass(CSS.BORDER_RED_1);
        } else {
            text.removeClass(CSS.BORDER_RED_1);
            input.removeClass(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        return 0;
    }
}

class CharUi_Section_TextArea {
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
        const header = new UI_Text(sectionTitle, {});

        const items = Array.from(sectionInfo?.values ?? []).map(valueInfo => new CharUi_Element_TextArea({
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
        const columnsCount = 2;

        containerBuilder.addRow().addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .setAttribute(ATTRIBUTES.COLSPAN, columnsCount)
            .appendChilds(header.getElement());

        for (const item of items) {
            const row = containerBuilder.addRow();
            row.addData().appendChilds(item.getTextElement());
            row.addData().appendChilds(item.getInputElement());
        }

        this.inner = {
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
        return this.inner.elements.container;
    }

    update() {
        const inner = this.inner;
        for (const item of inner.elements.items) {
            item.update();
        }
    }

    validate() {
        const elements = this.inner.elements;
        const errors = [
            ...(elements.items.flatMap(item => item.validate() ?? []) ?? []),
        ];

        this.setHighlight(errors.length > 0);

        return errors;
    }

    setHighlight(isVisible) {
        const container = this.inner.elements.container;
        if (isVisible) {
            container.addClass(CSS.BORDER_RED_1);
        } else {
            container.removeClass(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        const elements = this.inner.elements;
        const itemsPrice = elements.items?.reduce((acc, cur) => acc += cur.getPrice(), 0) ?? 0;
        return itemsPrice;
    }
}

export class CharUi_Part_TextArea {
    constructor(input) {
        const {
            data: {
                keeper,
                partInfo,
            },
            validations: {
                validations,
                dataForValidations,
            },
            updateEvent,
        } = input;

        const partValidations = validations?.[partInfo.id];
        const isEditable = validations?.editable && partValidations?.editable;

        const validationsInfo = { ...dataForValidations, part: partInfo.translation, };

        const data = keeper[partInfo.id] = keeper[partInfo.id] ?? {};

        const partTitle = partInfo.translation ?? EMPTY_STRING;
        const header = new UI_Text(partTitle, {});

        const sections = Array.from(partInfo.sections ?? []).map(section => new CharUi_Section_TextArea({
            data: {
                keeper: data,
                sectionInfo: section,
            },
            validations: {
                validations,
                partValidations: partValidations,
                dataForValidations: validationsInfo,
            },
            updateEvent,
        })) ?? [];

        const containerBuilder = DTableBuilder.init();

        containerBuilder.addRow().addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .setAttribute(ATTRIBUTES.COLSPAN, partInfo.sections.length)
            .appendChilds(header.getElement());

        const sectionsRow = containerBuilder.addRow();
        for (const section of sections) {
            sectionsRow.addData().appendChilds(section.getElement());
        }

        this.inner = {
            updateEvent,
            isEditable,
            validations: {
                info: validationsInfo,
                main: validations,
                part: partValidations,
            },
            data: {
                info: partInfo,
                data,
                partTitle,
            },
            elements: {
                header,
                sections,
                container: containerBuilder.create(),
            }
        };
    }

    getElement() {
        return this.inner.elements.container;
    }

    update() {
        const inner = this.inner;
        for (const section of inner.elements.sections) {
            section.update();
        }
    }

    validate() {
        const sections = this.inner.elements.sections;
        const validations = this.inner.validations
        const errors = sections.flatMap(item => item.validate() ?? []) ?? [];

        this.setHighlight(errors.length > 0);

        return errors;
    }

    setHighlight(isVisible) {
        const container = this.inner.elements.container;
        if (isVisible) {
            container.addClass(CSS.BORDER_RED_1);
        } else {
            container.removeClass(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        return this.inner.elements.sections.reduce((acc, cur) => acc += cur.getPrice(), 0);
    }
}