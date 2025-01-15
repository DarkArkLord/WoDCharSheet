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

        if (field !== undefined && defaultValue !== undefined && this.getValue() === undefined) {
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

const DEFAULT_POINTS_COUNT = 5;

export class CharValueElement {
    constructor(input) {
        const {
            keeper,
            valueInfo,
            valudations,
            validationsField,
            updateEvent,
            pointsCount = DEFAULT_POINTS_COUNT,
        } = input;

        const instance = this;

        this.updateEvent = updateEvent;

        this.info = valueInfo;

        this.validations = valudations;
        this.valueValidations = this.validations?.[validationsField];
        this.isEditable = valudations?.editable;

        this.data = keeper[valueInfo.id] = keeper[valueInfo.id] ?? {};
        this.wrapper = new CharValueWrapper(
            this.data,
            this.validations?.valueField,
            this.valueValidations?.min,
            this.validations?.prev,
            this.validations?.next,
        );

        const firstColumnAttrs = { class: CSS.TABLE_DATA };
        const otherColumnAttrs = { class: `${CSS.TABLE_DATA} ${CSS.LEFT_PADDING_5}` };

        this.text = new UIText('', firstColumnAttrs);
        this.specialty = new UITextInput(otherColumnAttrs);
        this.points = new UIPointsLine(pointsCount, this.isEditable, otherColumnAttrs);
        this.pointsText = new UIText('', otherColumnAttrs);

        this.pointsText.setVisible(this.isEditable);

        this.specialty.setOnChangedEvent(() => {
            const specialty = instance.specialty.getValue();
            instance.wrapper.setSpecialty(specialty);

            instance.updateEvent.invoke();
            // validate
        });

        this.points.subButton.setOnClickEvent(() => {
            const value = instance.wrapper.getValue();
            instance.wrapper.setValue(value - 1);

            instance.updateEvent.invoke();
            // validate
        });

        this.points.addButton.setOnClickEvent(() => {
            const value = instance.wrapper.getValue();
            instance.wrapper.setValue(value + 1);

            instance.updateEvent.invoke();
            // validate
        });

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
            this.specialty.setValue(this.wrapper.getSpecialty());

            const isSpecialtyEditable = totalValue >= specialtyEditableFrom;
            this.specialty.setReadOnly(!isSpecialtyEditable || hasNextValue);

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
        } else {
            this.points.setValue(0, totalValue);
        }

        this.points.subButton.setActive(!hasNextValue);
        this.points.addButton.setActive(!hasNextValue);
    }
}