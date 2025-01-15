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

        if (this.getValue() === undefined) {
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
}

const DEFAULT_POINTS_COUNT = 5;

export class CharValueElement {
    constructor(input) {
        const {
            keeper,
            valueInfo,
            totalValidations,
            validationsField,
            editValudations,
            editState,
            updateEvent,
        } = input;

        const instance = this;

        this.updateEvent = updateEvent;

        this.info = valueInfo;

        this.validations = editValudations?.[editState];
        this.valueValidations = this.validations?.[validationsField];
        this.totalValidations = totalValidations?.[validationsField];

        this.data = keeper[valueInfo.id] = keeper[valueInfo.id] ?? {};
        this.wrapper = new CharValueWrapper(
            this.data,
            editState,
            this.valueValidations?.min,
            this.validations?.prev,
            this.validations?.next,
        );

        const pointsCount = this.totalValidations?.totalMax ?? DEFAULT_POINTS_COUNT;
        const isPointsEditable = !!this.valueValidations;

        this.text = new UIText('', { class: CSS.TABLE_DATA });
        this.specialty = new UITextInput({ class: `${CSS.TABLE_DATA} ${CSS.LEFT_PADDING_5}` });
        this.points = new UIPointsLine(pointsCount, isPointsEditable, { class: `${CSS.TABLE_DATA} ${CSS.LEFT_PADDING_5}` });
        this.pointsText = new UIText('', { class: `${CSS.TABLE_DATA} ${CSS.LEFT_PADDING_5}` });

        this.pointsText.setVisible(isPointsEditable);

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
        const hasNextValue = !!this.wrapper.getNextValue();

        this.pointsText.setText(`(${value})`);

        const specialtyEditableFrom = this.valueValidations?.specialty;
        if (specialtyEditableFrom) {
            this.specialty.setVisible(true);
            this.specialty.setValue(this.wrapper.getSpecialty());

            const isSpecialtyEditable = this.wrapper.getTotalValue() >= specialtyEditableFrom;
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

        this.points.setValue(prevValue, value);

        this.points.subButton.setActive(!hasNextValue);
        this.points.addButton.setActive(!hasNextValue);
    }
}