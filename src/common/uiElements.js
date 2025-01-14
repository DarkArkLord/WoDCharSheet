import { SVGIcons } from '../common/svg.js'
import { HTMLTags, render } from '../common/render.js'
import { UITextInputType, UITextInput, UIText, UIIcon, UIPointsLine } from '../common/uiElementsBase.js'

const CSS = Object.freeze({
    TABLE: 'table',
    TABLE_ROW: 'tr',
    TABLE_DATA: 'td',
    LEFT_PADDING_5: 'left-padding-5px',
});

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

export class CharValueElement {
    constructor(keeper, valueInfo, validations, validationsField, editValudations, editState) {
        // this.input = { keeper, valueInfo, validations, validationsField, editValudations, editState, };
        this.info = valueInfo;

        this.validations = editValudations[editState];
        this.valueValidations = this.validations?.[validationsField];
        this.totalValidations = validations?.[validationsField];

        this.data = keeper[valueInfo.id] = keeper[valueInfo.id] ?? {};
        this.wrapper = new CharValueWrapper(this.data, editState, this.valueValidations?.min, this.validations?.prev, this.validations?.next);

        this.text = new UIText('', { class: CSS.TABLE_DATA });
        this.specialty = new UITextInput({ class: `${CSS.TABLE_DATA} ${CSS.LEFT_PADDING_5}` });
        this.points = new UIPointsLine(5, true, { class: `${CSS.TABLE_DATA} ${CSS.LEFT_PADDING_5}` });

        this.element = render(
            HTMLTags.Div,
            CSS.TABLE,
            render(
                HTMLTags.Div,
                CSS.TABLE_ROW,
                this.text,
                this.specialty,
                this.points,
            ),
        );

        this.update();
    }

    update() {
        const prevValue = this.wrapper.getPrevValue()
        const value = this.wrapper.getValue()
        const hasNextValue = !!this.wrapper.getNextValue();

        const specialty = this.valueValidations?.specialty;
        if (specialty) {
            this.specialty.setVisible(true);
            this.specialty.setValue(this.wrapper.getSpecialty());

            const isSpecialtyEditable = this.wrapper.getTotalValue() >= specialty;
            this.specialty.setReadOnly(isSpecialtyEditable && !hasNextValue);

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

        this.points.subButton.setVisible(!hasNextValue);
        this.points.subButton.setActive(!hasNextValue);
        this.points.addButton.setVisible(!hasNextValue);
        this.points.addButton.setActive(!hasNextValue);
    }
}