import { SVGIcons } from './svg.js'
import { HTMLTags, render } from './render.js'
import { UITextInputType, UITextInput, UIText, UIIcon, UIPointsLine } from './uiElements.js'

const CSS = Object.freeze({
    TABLE: 'table',
    TABLE_ROW: 'tr',
    TABLE_DATA: 'td',
    LEFT_PADDING_5: 'left-padding-5px',
    TEXT_ALIGN_CENTER: 'text-align-center',
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
            pointsCount = DEFAULT_POINTS_COUNT,
        } = input;

        const instance = this;

        this.updateEvent = updateEvent;

        this.info = valueInfo;

        this.validations = validations;
        this.valueValidations = partValidations;
        this.isEditable = validations?.editable;

        this.validationsInfo = { ...dataForValidations, value: valueInfo.translation, };

        this.data = keeper[valueInfo.id] = keeper[valueInfo.id] ?? {};
        this.wrapper = new CharValueWrapper(
            this.data,
            this.validations?.valueField,
            this.valueValidations?.min,
            this.validations?.prev,
            this.validations?.next,
        );
        this.priceWrapper = new CharValuePriceWrapper(this.wrapper, this.valueValidations?.price);

        this.text = new UIText(EMPTY_STRING, {});
        this.specialty = new UITextInput({}, UITextInputType.Text);
        this.points = new UIPointsLine(pointsCount, this.isEditable, {});
        this.priceText = new UIText(EMPTY_STRING, {});

        this.priceText.setVisible(this.isEditable);

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

                instance.priceWrapper.setDirty();

                instance.update();
                instance.updateEvent.invoke();
            });

            this.points.addButton.setOnClickEvent(() => {
                const value = instance.wrapper.getValue();
                instance.wrapper.setValue(value + 1);

                instance.priceWrapper.setDirty();

                instance.update();
                instance.updateEvent.invoke();
            });
        }

        this.element = render(
            HTMLTags.Table, {},
            render(
                HTMLTags.TableRow, {},
                render(HTMLTags.TableData, {}, this.text.element),
                render(HTMLTags.TableData, {}, this.specialty.element),
                render(HTMLTags.TableData, {}, this.points.element),
                render(HTMLTags.TableData, {}, this.priceText.element),
            ),
        );

        this.update();
    }

    update() {
        const prevValue = this.wrapper.getPrevValue()
        const value = this.wrapper.getValue()
        const hasNextValue = this.wrapper.hasNextValue();
        const totalValue = this.wrapper.getTotalValue();

        this.priceText.setText(`(${this.priceWrapper.getPrice()})`);

        const specialtyEditableFrom = this.valueValidations?.specialty;
        if (specialtyEditableFrom) {
            this.specialty.setVisible(true);
            this.specialty.setReadOnly(prevValue + value < specialtyEditableFrom);

            if (totalValue >= specialtyEditableFrom) {
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
    }

    validate() {
        const errors = [];

        const totalValue = this.wrapper.getTotalValue();
        if (totalValue < this.valueValidations?.totalMin) {
            errors.push({
                ...this.validationsInfo,
                text: `Не может быть меньше ${this.valueValidations?.totalMin}`,
            });
        }
        if (totalValue > this.valueValidations?.totalMax) {
            errors.push({
                ...this.validationsInfo,
                text: `Не может быть больше ${this.valueValidations?.totalMax}`,
            });
        }

        return errors;
    }

    getPrice() {
        return this.priceWrapper.getPrice();
    }
}

export class CharLineValuesSectionElement {
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

        this.isEditable = validations?.editable;

        this.validationsInfo = { ...dataForValidations, section: sectionInfo.translation, };

        this.info = sectionInfo;

        this.sectionTitle = sectionInfo.translation ?? EMPTY_STRING;
        this.header = new UIText(this.sectionTitle, {});

        this.items = sectionInfo?.values?.map(valueInfo => new CharLineValueElement({
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
                render(HTMLTags.TableData, {}, item.points.element),
                render(HTMLTags.TableData, {}, item.priceText.element),
            )),
        );

        this.update();
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
        const errors = this.items.flatMap(item => item.validate() ?? []);

        //

        return errors;
    }

    getPrice() {
        return this.items.reduce((acc, cur) => acc += cur.getPrice(), 0);
    }
}

export class CharLineValuesSectionsPartElement {
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
        this.valueValidations = validations?.[partInfo.id];
        this.isEditable = validations?.editable;

        this.validationsInfo = { ...dataForValidations, part: partInfo.translation, };

        this.info = partInfo;
        this.data = keeper[partInfo.id] = keeper[partInfo.id] ?? {};

        this.partTitle = partInfo.translation ?? EMPTY_STRING;
        this.header = new UIText(this.partTitle, {});

        this.sections = partInfo.sections?.map(section => new CharLineValuesSectionElement({
            data: {
                keeper: this.data,
                sectionInfo: section,
            },
            validations: {
                validations,
                partValidations: this.valueValidations,
                dataForValidations: this.validationsInfo,
            },
            updateEvent,
        })) ?? [];

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

        this.update();
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
        const errors = this.items.flatMap(item => item.validate() ?? []);

        if (this.valueValidations?.sectionPoints) {
            const validPoints = this.valueValidations.sectionPoints.slice().sort();
            const currentPoints = this.sections.map(section => section.getPrice()).sort();

            if (JSON.stringify(validPoints) !== JSON.stringify(currentPoints)) {
                const validPointsStr = validPoints.join('/');
                const currentPointsStr = currentPoints.join('/');
                errors.push({
                    ...this.validationsInfo,
                    text: `Между секциями должно быть распределено ${validPointsStr} точек (сейчас ${currentPointsStr})`,
                });
            }
        }

        if (this.valueValidations?.freePoints !== undefined) {
            const price = this.getPrice();

            if (price !== this.valueValidations.freePoints) {
                errors.push({
                    ...this.validationsInfo,
                    text: `Должно быть распределено ${this.valueValidations.freePoints} точек (сейчас ${price})`,
                });
            }
        }

        return errors;
    }

    getPrice() {
        return this.sections.reduce((acc, cur) => acc += cur.getPrice(), 0);
    }
}