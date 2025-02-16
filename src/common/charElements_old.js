import { SVGIcons } from './svg.js'
import { HTMLTags, render } from './render.js'
import { DarkEvent, ValueWrapper } from './utilities.js'
import { UITextInputType, UITextInput, UIText, UIIcon, UIPointsLine, UIButton, UIDropdown } from './uiElements_old.js'

const CSS = Object.freeze({
    TABLE: 'table',
    TABLE_ROW: 'tr',
    TABLE_DATA: 'td',
    LEFT_PADDING_5: 'left-padding-5px',
    TEXT_ALIGN_CENTER: 'text-align-center',
    NOWRAP: 'nowrap',
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
const POINTS_FIELD = 'points';

class CharUiDotsElement { // +
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
        this.dots = new UIPointsLine(this.dotsCount, this.isEditable, { class: CSS.NOWRAP });

        if (this.isEditable) {
            this.dots.subButton.setOnClickEvent(() => {
                const value = instance.wrapper.getValue();
                instance.wrapper.setValue(value - 1);

                instance.priceWrapper.setDirty();

                instance.updateEvent.invoke();
            });

            this.dots.addButton.setOnClickEvent(() => {
                const value = instance.wrapper.getValue();
                instance.wrapper.setValue(value + 1);

                instance.priceWrapper.setDirty();

                instance.updateEvent.invoke();
            });
        }

        this.element = this.dots.element;
    }

    update() {
        if (this.isEditable) {
            const prevValue = this.wrapper.getPrevValue(0);
            const value = this.wrapper.getValue(0);
            const hasNextValue = this.wrapper.hasNextValue();

            this.dots.setValue(prevValue, value);

            const enableSubButton = this.dotsInputValidations?.min === undefined ? true : value > this.dotsInputValidations?.min;
            this.dots.subButton.setActive(enableSubButton && !hasNextValue);
            const enableAddButton = (this.dotsInputValidations?.max === undefined ? true : value < this.dotsInputValidations?.max)
                && prevValue + value < this.dotsCount;
            this.dots.addButton.setActive(enableAddButton && !hasNextValue);
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

class CharUiTextWithDotsElement { // +
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

        this.updateEvent = updateEvent;

        this.info = valueInfo;

        this.validations = validations;
        this.partValidations = partValidations;
        this.isEditable = validations?.editable && partValidations?.editable;

        this.validationsInfo = { ...dataForValidations, value: valueInfo.translation, };

        const data = keeper[valueInfo.id] = keeper[valueInfo.id] ?? {};

        // Elements
        this.text = new UIText(valueInfo.translation, {});

        this.dots = new CharUiDotsElement({
            data,
            validations: {
                validations,
                partValidations,
                dataForValidations: this.validationsInfo,
            },
            updateEvent,
        });
    }

    update() {
        this.dots.update();
    }

    validate() {
        const errors = this.dots.validate() ?? [];

        this.setHighlight(errors.length > 0);

        return errors;
    }

    setHighlight(isVisible) {
        if (isVisible) {
            this.text.element.classList.add(CSS.BORDER_RED_1);
            this.dots.element.classList.add(CSS.BORDER_RED_1);
        } else {
            this.text.element.classList.remove(CSS.BORDER_RED_1);
            this.dots.element.classList.remove(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        return this.dots.getPrice();
    }
}

class CharUiLineDotsElement extends CharUiTextWithDotsElement { // +
    constructor(input) {
        super(input);

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

        const instance = this;

        this.specialtyWrapper = new ValueWrapper(this.dots.data, SPECIALTY_FIELD, EMPTY_STRING);

        // Elements
        this.specialty = new UITextInput({}, UITextInputType.Text, null, null, DEFAULT_INPUT_SIZE);

        if (this.isEditable) {
            this.specialty.setOnChangedEvent(() => {
                const specialty = instance.specialty.getValue();
                instance.specialtyWrapper.setValue(specialty);

                instance.update();
                instance.updateEvent.invoke();
            });
        }

        this.priceText = new UIText(EMPTY_STRING, {});
        this.priceText.setVisible(this.isEditable);
    }

    update() {
        const prevValue = this.dots.wrapper.getPrevValue()
        const value = this.dots.wrapper.getValue(0)
        const totalValue = this.dots.wrapper.getTotalValue(0);

        this.priceText.setText(`(${this.getPrice()})`);

        const configSpecialtyEditableFrom = this.partValidations?.specialtyEditableFrom;
        if (!!configSpecialtyEditableFrom) {
            const specialtyEditableFrom = this.info?.specialtyEditableFrom
                ?? configSpecialtyEditableFrom;

            this.specialty.setVisible(true);
            this.specialty.setReadOnly(prevValue + value < specialtyEditableFrom);

            if (totalValue >= specialtyEditableFrom) {
                this.specialty.setValue(this.specialtyWrapper.getValue());
            } else {
                this.specialtyWrapper.setValue(EMPTY_STRING);
                this.specialty.setValue(EMPTY_STRING);
            }

            this.text.setText(this.info.translation);
        } else {
            this.specialty.setVisible(false);

            const crudeText = this.specialtyWrapper.getValue().trim();
            const text = crudeText.length > 0
                ? `${this.info.translation} (${crudeText})`
                : this.info.translation
            this.text.setText(text);
        }

        super.update();
    }
}

class CharUiLineDotsSectionElement { // +
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

        this.updateEvent = updateEvent;

        this.isEditable = validations?.editable && partValidations?.editable;

        this.validationsInfo = { ...dataForValidations, section: sectionInfo.translation, };

        this.info = sectionInfo;

        this.sectionTitle = sectionInfo.translation ?? EMPTY_STRING;
        this.header = new UIText(this.sectionTitle, {});

        this.items = sectionInfo?.values?.map(valueInfo => new CharUiLineDotsElement({
            data: {
                keeper,
                valueInfo,
            },
            validations: {
                validations,
                partValidations,
                dataForValidations: this.validationsInfo,
            },
            updateEvent,
        })) ?? [];

        // Elements
        this.element = render(
            HTMLTags.Table, {},
            render(
                HTMLTags.TableRow, {},
                render(
                    HTMLTags.TableData,
                    { class: CSS.TEXT_ALIGN_CENTER, colspan: 4, },
                    this.header.element,
                ),
            ),
            this.items.map(item => render(
                HTMLTags.TableRow, {},
                render(HTMLTags.TableData, {}, item.text.element),
                render(HTMLTags.TableData, {}, item.specialty.element),
                render(HTMLTags.TableData, {}, item.dots.element),
                render(HTMLTags.TableData, {}, item.priceText.element),
            )),
        );
    }

    update() {
        for (const item of this.items) {
            item.update();
        }

        if (this.isEditable) {
            this.header.setText(`${this.sectionTitle} (${this.getPrice()})`);
        }
    }

    validate() {
        const errors = this.items?.flatMap(item => item.validate() ?? []) ?? [];

        this.setHighlight(errors.length > 0);

        return errors;
    }

    setHighlight(isVisible) {
        if (isVisible) {
            this.element.classList.add(CSS.BORDER_RED_1);
        } else {
            this.element.classList.remove(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        return this.items.reduce((acc, cur) => acc += cur.getPrice(), 0);
    }
}

export class CharUiLineDotsSectionsPartElement { // +
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

        this.updateEvent = updateEvent;

        this.validations = validations;
        this.partValidations = validations?.[partInfo.id];
        this.isEditable = validations?.editable && this.partValidations?.editable;

        this.validationsInfo = { ...dataForValidations, part: partInfo.translation, };

        this.info = partInfo;
        this.data = keeper[partInfo.id] = keeper[partInfo.id] ?? {};

        this.partTitle = partInfo.translation ?? EMPTY_STRING;
        this.header = new UIText(this.partTitle, {});

        this.sections = partInfo.sections?.map(section => new CharUiLineDotsSectionElement({
            data: {
                keeper: this.data,
                sectionInfo: section,
            },
            validations: {
                validations,
                partValidations: this.partValidations,
                dataForValidations: this.validationsInfo,
            },
            updateEvent,
        })) ?? [];

        // Elements
        this.element = render(
            HTMLTags.Table, {},
            render(
                HTMLTags.TableRow, {},
                render(
                    HTMLTags.TableData,
                    { class: CSS.TEXT_ALIGN_CENTER, colspan: partInfo.sections.length, },
                    this.header.element,
                ),
            ),
            render(
                HTMLTags.TableRow, {},
                this.sections.map(section => render(HTMLTags.TableData, {}, section.element)),
            ),
        );
    }

    update() {
        for (const section of this.sections) {
            section.update();
        }

        if (this.isEditable) {
            this.header.setText(`${this.partTitle} (${this.getPrice()})`);
        }
    }

    validate() {
        const errors = this.sections?.flatMap(item => item.validate() ?? []) ?? [];

        if (this.partValidations?.sectionPoints) {
            const validPoints = this.partValidations.sectionPoints.slice().sort(DEFAULT_COMPARATOR);
            const currentPoints = this.sections.map(section => section.getPrice()).sort(DEFAULT_COMPARATOR);

            if (JSON.stringify(validPoints) !== JSON.stringify(currentPoints)) {
                const validPointsStr = validPoints.join('/');
                const currentPointsStr = currentPoints.join('/');
                errors.push({
                    ...this.validationsInfo,
                    text: `Между секциями должно быть распределено ${validPointsStr} точек (сейчас ${currentPointsStr})`,
                });
            }
        }

        if (this.partValidations?.freePoints !== undefined) {
            const price = this.getPrice();

            if (price !== this.partValidations.freePoints) {
                errors.push({
                    ...this.validationsInfo,
                    text: `Должно быть распределено ${this.partValidations.freePoints} точек (сейчас ${price})`,
                });
            }
        }

        this.setHighlight(errors.length > 0);

        return errors;
    }

    setHighlight(isVisible) {
        if (isVisible) {
            this.element.classList.add(CSS.BORDER_RED_1);
        } else {
            this.element.classList.remove(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        return this.sections.reduce((acc, cur) => acc += cur.getPrice(), 0);
    }
}

export class CharUiBlockDotsElement extends CharUiTextWithDotsElement { // +
    constructor(input) {
        super(input);

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

        // Elements
        this.element = render(
            HTMLTags.Table, {},
            render(
                HTMLTags.TableRow, {},
                render(HTMLTags.TableData, { class: CSS.TEXT_ALIGN_CENTER }, this.text.element),
            ),
            render(
                HTMLTags.TableRow, { class: CSS.TEXT_ALIGN_CENTER },
                render(HTMLTags.TableData, {}, this.dots.element),
            ),
        );
    }

    update() {
        if (this.isEditable) {
            this.text.setText(`${this.info.translation} (${this.getPrice()})`)
        }

        super.update();
    }

    setHighlight(isVisible) {
        if (isVisible) {
            this.element.classList.add(CSS.BORDER_RED_1);
        } else {
            this.element.classList.remove(CSS.BORDER_RED_1);
        }
    }
}

class CharUiTextOrInputElement { // +
    constructor(input) {
        const {
            data: {
                data,
                fieldName,
                defaultValue = EMPTY_STRING,
            } = {},
            textConfig: {
                wrapAttributes: textAttributes = {},
            } = {},
            inputConfig: {
                wrapAttributes: inputAttributes = {},
                styles: inputStyles = undefined,
                type: inputType = UITextInputType.Text,
                min: inputMin = undefined,
                max: inputMax = undefined,
                size: inputSize = DEFAULT_INPUT_SIZE,
                valueMapper = x => x,
            } = {},
            isEditable = false,
            updateEvent,
        } = input;

        const instance = this;

        this.updateEvent = updateEvent;

        this.isEditable = isEditable;

        this.textWrapper = new ValueWrapper(data, fieldName, defaultValue);

        // Elements
        this.text = new UIText(defaultValue, textAttributes);
        this.input = new UITextInput(inputAttributes, inputType, inputMin, inputMax, inputSize, inputStyles);
        if (this.isEditable) {
            this.input.setOnChangedEvent(() => {
                const text = instance.input.getValue();
                const result = valueMapper(text);
                instance.textWrapper.setValue(result);
                instance.updateEvent.invoke();
            });
        }

        this.element = isEditable ? this.input.element : this.text.element;
    }

    getValue() {
        return this.textWrapper.getValue();
    }

    setValue(text) {
        this.textWrapper.setValue(text);
        this.text.setText(text);
        this.input.setValue(text);
    }

    update() {
        this.setValue(this.textWrapper.getValue());
    }
}

class CharUiLineInputDotsWithVariantsItemElement { // +
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

        const instance = this;

        this.updateEvent = updateEvent;

        this.validations = validations;
        this.partValidations = partValidations;
        this.isEditable = validations?.editable && partValidations?.editable;

        this.validationsInfo = { ...dataForValidations, commonValue: EMPTY_STRING };

        // Elements
        this.removeButton = new UIButton(SVGIcons.BUTTON_SUB_ENABLED, SVGIcons.BUTTON_SUB_DISABLED);
        this.removeButton.setVisible(this.isEditable);

        this.text = new CharUiTextOrInputElement({
            data: {
                data,
                fieldName: TEXT_FIELD,
            },
            isEditable: this.isEditable,
            updateEvent,
        });

        this.variants = new UIDropdown({ class: CSS.DROPDOWN_AS_BUTTON }, { addEmptyOption: true, defaultOptions });
        this.variants.setVisible(this.isEditable);
        if (this.isEditable) {
            this.variants.setOnChangeEvent(eventInput => {
                const text = eventInput.target.value;
                eventInput.target.selectedIndex = 0;

                instance.text.setValue(text);
                instance.updateEvent.invoke();
            });
        }

        this.dots = new CharUiDotsElement({
            data,
            validations: {
                validations,
                partValidations,
                dataForValidations: this.validationsInfo,
            },
            updateEvent,
        });

        this.priceText = new UIText(EMPTY_STRING, {});
        this.priceText.setVisible(this.isEditable);
    }

    update() {
        this.text.update();
        this.dots.update();

        this.priceText.setText(`(${this.getPrice()})`);

        const hasPrevValue = this.dots.wrapper.hasPrevValue();
        const hasNextValue = this.dots.wrapper.hasNextValue();
        this.removeButton.setActive(!hasPrevValue && !hasNextValue);

        this.validationsInfo.commonValue = this.text.getValue();
    }

    validate() {
        const errors = this.dots.validate() ?? [];

        this.setDotsHighlight(errors.length > 0);

        const text = this.text.getValue().trim();
        if (this.isEditable && text.length < 1) {
            errors.push({
                ...this.validationsInfo,
                text: `Необходимо заполнит текст`,
            });

            this.setTextHighlight(true);
        } else {
            this.setTextHighlight(false);
        }

        return errors;
    }

    setTextHighlight(isVisible) {
        if (isVisible) {
            this.text.element.classList.add(CSS.BORDER_RED_1);
        } else {
            this.text.element.classList.remove(CSS.BORDER_RED_1);
        }
    }

    setDotsHighlight(isVisible) {
        if (isVisible) {
            this.dots.element.classList.add(CSS.BORDER_RED_1);
        } else {
            this.dots.element.classList.remove(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        return this.dots.getPrice();
    }
}

export class CharUiLineInputDotsWithVariantsListElement { // +
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

        const instance = this;

        this.updateEvent = updateEvent;

        this.info = valueInfo;

        this.validations = validations;
        this.partValidations = partValidations;
        this.isEditable = validations?.editable && partValidations?.editable;

        this.validationsInfo = { ...dataForValidations, value: valueInfo.translation, };

        this.data = keeper[valueInfo.id] = keeper[valueInfo.id] ?? [];

        // Elements
        const COLS_IN_ROW = 5;

        this.headerText = valueInfo.translation;
        this.header = new UIText(this.headerText, {});
        this.headerRow = render(
            HTMLTags.TableRow, {},
            render(
                HTMLTags.TableData,
                { class: CSS.TEXT_ALIGN_CENTER, colspan: COLS_IN_ROW },
                this.header.element,
            ),
        );

        this.optionsForItemWrapper = (valueInfo.variants ?? []).map(variant => ({
            text: variant.translation,
            attrubutes: {},
        }));

        this.items = [];

        this.addButton = new UIButton(SVGIcons.BUTTON_ADD_ENABLED, SVGIcons.BUTTON_ADD_DISABLED);
        this.addButton.setVisible(this.isEditable);
        if (this.isEditable) {
            this.addButton.setOnClickEvent(() => {
                instance.data.push({});
                instance.updateEvent.invoke();
            });
        }

        this.addButtonRow = render(
            HTMLTags.TableRow, {},
            render(
                HTMLTags.TableData,
                { class: CSS.TEXT_ALIGN_CENTER, colspan: COLS_IN_ROW },
                this.addButton.element
            ),
        );

        this.element = render(HTMLTags.Table, {});

        this.refreshItems();
    }

    createItemWrapper(itemData) {
        const item = new CharUiLineInputDotsWithVariantsItemElement({
            data: {
                data: itemData,
                defaultOptions: this.optionsForItemWrapper,
            },
            validations: {
                validations: this.validations,
                partValidations: this.partValidations,
                dataForValidations: this.validationsInfo,
            },
            updateEvent: this.updateEvent,
        });

        const instance = this;

        item.removeButton.setOnClickEvent(() => {
            const dataIndex = instance.data.findIndex(value => value === itemData);
            if (dataIndex >= 0) {
                instance.data.splice(dataIndex, 1);
                instance.updateEvent.invoke();
            }
        });

        return item;
    }

    refreshItems() {
        this.items = [];
        this.element.innerHTML = EMPTY_STRING;

        this.element.append(this.headerRow);

        for (const itemData of this.data) {
            const item = this.createItemWrapper(itemData);

            this.items.push(item);

            this.element.append(render(
                HTMLTags.TableRow, {},
                render(HTMLTags.TableData, {}, item.removeButton.element),
                render(HTMLTags.TableData, {}, item.text.element),
                render(HTMLTags.TableData, {}, item.variants.element),
                render(HTMLTags.TableData, {}, item.dots.element),
                render(HTMLTags.TableData, {}, item.priceText.element),
            ));
        }

        if (this.isEditable) {
            this.element.append(this.addButtonRow);
        }
    }

    update() {
        if (this.items.length !== this.data.length) {
            this.refreshItems();
        }

        for (const item of this.items) {
            item.update();
        }

        if (this.isEditable) {
            this.header.setText(`${this.headerText} (${this.getPrice()})`);
        }
    }

    validate() {
        const errors = this.items.flatMap(item => item.validate() ?? []) ?? [];

        if (this.partValidations?.freePoints !== undefined) {
            const price = this.getPrice();

            if (price !== this.partValidations.freePoints) {
                errors.push({
                    ...this.validationsInfo,
                    text: `Должно быть распределено ${this.partValidations.freePoints} точек (сейчас ${price})`,
                });
            }
        }

        this.setHighlight(errors.length > 0);

        return errors;
    }

    setHighlight(isVisible) {
        if (isVisible) {
            this.element.classList.add(CSS.BORDER_RED_1);
        } else {
            this.element.classList.remove(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        return this.items.reduce((acc, cur) => acc += cur.getPrice(), 0);
    }
}

class CharUiPointsByStateElement {
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

        this.updateEvent = updateEvent;

        this.validations = validations;
        this.partValidations = partValidations;
        this.pointsInputValidations = partValidations?.pointsInput;
        this.isEditable = validations?.editable && partValidations?.editable;

        this.data = data;
        this.wrapper = new ValueByStateWrapper(
            this.data,
            this.validations?.state,
            this.pointsInputValidations?.min ?? 0,
            this.validations?.prev,
            this.validations?.next,
        );

        this.prevValueText = new UIText(EMPTY_STRING, {});
        this.points = new CharUiTextOrInputElement({
            data: {
                data: this.data,
                fieldName: this.validations?.state,
                defaultValue: this.pointsInputValidations?.min ?? 0,
            },
            inputConfig: {
                type: UITextInputType.Number,
                min: this.pointsInputValidations?.min ?? 0,
                size: undefined,
                styles: inputStyle,
                valueMapper: x => +x,
            },
            isEditable: this.isEditable,
            updateEvent,
        });
        this.nextValueText = new UIText(EMPTY_STRING, {});

        this.totalText = new UIText(EMPTY_STRING, {});

        this.element = this.isEditable
            ? render(HTMLTags.Table, {},
                render(HTMLTags.TableRow, {},
                    render(HTMLTags.TableData, {}, this.prevValueText.element),
                    render(HTMLTags.TableData, {}, this.points.element),
                    render(HTMLTags.TableData, {}, this.nextValueText.element),
                ),
            )
            : this.totalText.element;
    }

    update() {
        this.prevValueText.setText(`${this, this.wrapper.getPrevValue()} /`);
        this.points.update();
        this.nextValueText.setText(`/ ${this, this.wrapper.getNextValue()}`);
        this.totalText.setText(this.wrapper.getTotalValue(0));
    }

    getValue() {
        return this.points.getValue();
    }

    setValue(value) {
        this.points.setValue(value);
    }
}

class CharUiLineInputPointsWithVariantsItemElement {
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

        const instance = this;

        this.updateEvent = updateEvent;

        this.validations = validations;
        this.partValidations = partValidations;
        this.isEditable = validations?.editable && partValidations?.editable;

        this.validationsInfo = { ...dataForValidations, commonValue: EMPTY_STRING };

        // Elements
        this.removeButton = new UIButton(SVGIcons.BUTTON_SUB_ENABLED, SVGIcons.BUTTON_SUB_DISABLED);
        this.removeButton.setVisible(this.isEditable);

        this.text = new CharUiTextOrInputElement({
            data: {
                data,
                fieldName: TEXT_FIELD,
            },
            isEditable: this.isEditable,
            updateEvent,
        });

        this.type = new CharUiTextOrInputElement({
            data: {
                data,
                fieldName: TYPE_FIELD,
            },
            inputConfig: {
                size: 4,
            },
            isEditable: this.isEditable,
            updateEvent,
        });

        this.points = new CharUiPointsByStateElement({
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

        this.variants = new UIDropdown({ class: CSS.DROPDOWN_AS_BUTTON }, { addEmptyOption: true, defaultOptions });
        this.variants.setVisible(this.isEditable);
        if (this.isEditable) {
            this.variants.setOnChangeEvent(eventInput => {
                const value = JSON.parse(eventInput.target.value);
                eventInput.target.selectedIndex = 0;

                instance.text.setValue(value.text);
                instance.type.setValue(value.type);
                instance.points.setValue(value.cost);

                instance.updateEvent.invoke();
            });
        }
    }

    update() {
        this.text.update();
        this.type.update();
        this.points.update();

        const hasPrevValue = this.points.wrapper.hasPrevValue();
        const hasNextValue = this.points.wrapper.hasNextValue();
        this.removeButton.setActive(!hasPrevValue && !hasNextValue);

        this.validationsInfo.commonValue = this.text.getValue();
    }

    validate() {
        const errors = [];

        const text = this.text.getValue();
        if (this.isEditable && text.length < 1) {
            errors.push({
                ...this.validationsInfo,
                text: `Необходимо заполнит текст`,
            });

            this.setTextHighlight(true);
        } else {
            this.setTextHighlight(false);
        }

        const type = this.type.getValue();
        if (this.isEditable && type.length < 1) {
            errors.push({
                ...this.validationsInfo,
                text: `Необходимо заполнит тип`,
            });

            this.setTypeHighlight(true);
        } else {
            this.setTypeHighlight(false);
        }

        const points = this.points.getValue();
        if (this.isEditable && (points === undefined || points === EMPTY_STRING)) {
            errors.push({
                ...this.validationsInfo,
                text: `Необходимо заполнить стоимость`,
            });

            this.setPointsHighlight(true);
        } else if (this.isEditable && Number.isNaN(+points)) {
            errors.push({
                ...this.validationsInfo,
                text: `Необходимо стоимость должна быть число`,
            });

            this.setPointsHighlight(true);
        } else {
            this.setPointsHighlight(false);
        }

        return errors;
    }

    setTextHighlight(isVisible) {
        if (isVisible) {
            this.text.element.classList.add(CSS.BORDER_RED_1);
        } else {
            this.text.element.classList.remove(CSS.BORDER_RED_1);
        }
    }

    setTypeHighlight(isVisible) {
        if (isVisible) {
            this.type.element.classList.add(CSS.BORDER_RED_1);
        } else {
            this.type.element.classList.remove(CSS.BORDER_RED_1);
        }
    }


    setPointsHighlight(isVisible) {
        if (isVisible) {
            this.points.element.classList.add(CSS.BORDER_RED_1);
        } else {
            this.points.element.classList.remove(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        const price = +this.points.getValue();
        return Number.isNaN(price) ? 0 : price;
    }
}

export class CharUiLineInputPointsWithVariantsListElement {
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

        const instance = this;

        this.updateEvent = updateEvent;

        this.info = valueInfo;

        this.validations = validations;
        this.partValidations = partValidations;
        this.listInputValidations = partValidations?.listInput;
        this.pointsInputValidations = partValidations?.pointsInput;
        this.isEditable = validations?.editable && partValidations?.editable;

        this.validationsInfo = { ...dataForValidations, value: valueInfo.translation, };

        this.data = keeper[valueInfo.id] = keeper[valueInfo.id] ?? [];

        // Elements
        const COLS_IN_ROW = 5;

        this.headerText = valueInfo.translation;
        this.header = new UIText(this.headerText, {});
        this.headerRow = render(
            HTMLTags.TableRow, {},
            render(
                HTMLTags.TableData,
                { class: CSS.TEXT_ALIGN_CENTER, colspan: COLS_IN_ROW },
                this.header.element,
            ),
        );

        this.optionsForItemWrapper = (valueInfo.variants ?? []).flatMap(variant =>
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

        this.items = [];

        this.addButton = new UIButton(SVGIcons.BUTTON_ADD_ENABLED, SVGIcons.BUTTON_ADD_DISABLED);
        this.addButton.setVisible(this.isEditable);
        if (this.isEditable) {
            this.addButton.setOnClickEvent(() => {
                instance.data.push({});
                instance.updateEvent.invoke();
            });
        }

        this.addButtonRow = render(
            HTMLTags.TableRow, {},
            render(
                HTMLTags.TableData,
                { class: CSS.TEXT_ALIGN_CENTER, colspan: COLS_IN_ROW },
                this.addButton.element
            ),
        );

        this.element = render(HTMLTags.Table, {});

        this.refreshItems();
    }

    createItemWrapper(itemData) {
        const item = new CharUiLineInputPointsWithVariantsItemElement({
            data: {
                data: itemData,
                defaultOptions: this.optionsForItemWrapper,
            },
            validations: {
                validations: this.validations,
                partValidations: this.partValidations,
                dataForValidations: this.validationsInfo,
            },
            updateEvent: this.updateEvent,
        });

        const instance = this;

        item.removeButton.setOnClickEvent(() => {
            const dataIndex = instance.data.findIndex(value => value === itemData);
            if (dataIndex >= 0) {
                instance.data.splice(dataIndex, 1);
                instance.updateEvent.invoke();
            }
        });

        return item;
    }

    refreshItems() {
        this.items = [];
        this.element.innerHTML = EMPTY_STRING;

        this.element.append(this.headerRow);

        for (const itemData of this.data) {
            const item = this.createItemWrapper(itemData);

            this.items.push(item);

            this.element.append(render(
                HTMLTags.TableRow, {},
                render(HTMLTags.TableData, {}, item.removeButton.element),
                render(HTMLTags.TableData, {}, item.text.element),
                render(HTMLTags.TableData, {}, item.type.element),
                render(HTMLTags.TableData, {}, item.points.element),
                render(HTMLTags.TableData, {}, item.variants.element),
            ));
        }

        if (this.isEditable) {
            this.element.append(this.addButtonRow);
        }
    }

    update() {
        if (this.items.length !== this.data.length) {
            this.refreshItems();
        }

        for (const item of this.items) {
            item.update();
        }

        if (this.isEditable) {
            this.header.setText(`${this.headerText} (${this.getPrice()})`);
        }
    }

    validate() {
        const errors = this.items.flatMap(item => item.validate() ?? []) ?? [];

        const totalPrice = this.items.reduce((acc, cur) => acc + cur.getPrice(0), 0);
        if (totalPrice > this.listInputValidations?.maxPointsSum) {
            errors.push({
                ...this.validationsInfo,
                text: `Набрано больше ${this.listInputValidations?.maxPointsSum} очков (сейчас ${totalPrice})`,
            });
        }

        this.setHighlight(errors.length > 0);

        return errors;
    }

    setHighlight(isVisible) {
        if (isVisible) {
            this.element.classList.add(CSS.BORDER_RED_1);
        } else {
            this.element.classList.remove(CSS.BORDER_RED_1);
        }
    }

    getPrice() {
        const price = this.items.reduce((acc, cur) => acc += cur.getPrice(), 0);
        return this.pointsInputValidations?.negativePrice ? -price : price;
    }
}

export class CharUiBlockPointsElement {
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

        const instance = this;

        this.updateEvent = updateEvent;

        this.info = valueInfo;

        this.validations = validations;
        this.partValidations = partValidations;
        this.pointsInputValidations = partValidations?.pointsInput;
        this.isEditable = validations?.editable && partValidations?.editable;

        this.validationsInfo = { ...dataForValidations, value: valueInfo.translation, };

        // Elements
        this.text = new UIText(valueInfo.translation, {});
        this.points = new CharUiTextOrInputElement({
            data: {
                data: keeper,
                fieldName: valueInfo.id,
                defaultValue: this.pointsInputValidations?.min ?? 0,
            },
            inputConfig: {
                type: UITextInputType.Number,
                min: this.pointsInputValidations?.min ?? 0,
                size: undefined,
                styles: 'width: 100px',
                valueMapper: x => +x,
            },
            isEditable: this.isEditable,
            updateEvent,
        });

        this.element = render(
            HTMLTags.Table, {},
            render(
                HTMLTags.TableRow, {},
                render(HTMLTags.TableData, { class: CSS.TEXT_ALIGN_CENTER }, this.text.element),
            ),
            render(
                HTMLTags.TableRow, { class: CSS.TEXT_ALIGN_CENTER },
                render(HTMLTags.TableData, {}, this.points.element),
            ),
        );
    }

    update() {
        this.points.update();
    }

    validate() {
        return [];
    }

    getPrice() {
        return 0;
    }
}