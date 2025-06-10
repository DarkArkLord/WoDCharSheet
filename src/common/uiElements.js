import { DElementBuilder, ATTRIBUTES, EVENTS, ACTIONS } from './domWrapper.js'
import { SVGIcons } from './svg.js'

const EMPTY_STRING = '';

const CSS = Object.freeze({
    NOWRAP: 'nowrap',
});

export class UI_Icon {
    constructor(baseImage) {
        this.inner = {
            element: DElementBuilder.initImg()
                .setAttribute(ATTRIBUTES.SRC, baseImage)
                .create(),
        };
    }

    getElement() {
        return this.inner.element;
    }

    setImage(image) {
        this.inner.element.setAttribute(ATTRIBUTES.SRC, image);
    }
}

export class UI_Icon_Point extends UI_Icon {
    constructor() {
        super(SVGIcons.POINT_EMPTY);
    }

    setEmpty() {
        this.setImage(SVGIcons.POINT_EMPTY);
    }

    setActive() {
        this.setImage(SVGIcons.POINT_ACTIVE);
    }

    setDisable() {
        this.setImage(SVGIcons.POINT_DISABLED);
    }
}

export class UI_Icon_Button extends UI_Icon {
    constructor(enableImage, disableImage) {
        super(enableImage);

        this.inner.enableImage = enableImage;
        this.inner.disableImage = disableImage;
    }

    setActive(isActive) {
        this.inner.element.setActive(isActive);
        this.setImage(isActive ? this.inner.enableImage : this.inner.disableImage);
    }

    setVisible(isVisible) {
        this.inner.element.setVisible(isVisible);
    }

    setOnClickEvent(func) {
        this.inner.element.setEventHandler(EVENTS.CLICK, func);
    }
}

export class UI_PointsLine {
    constructor(pointsCount, showButtons) {
        const subButton = new UI_Icon_Button(SVGIcons.BUTTON_SUB_ENABLED, SVGIcons.BUTTON_SUB_DISABLED);
        const points = Array.from(Array(pointsCount)).map(_ => new UI_Icon_Point());
        const addButton = new UI_Icon_Button(SVGIcons.BUTTON_ADD_ENABLED, SVGIcons.BUTTON_ADD_DISABLED);

        subButton.setVisible(showButtons);
        addButton.setVisible(showButtons);

        this.inner = {
            pointsCount,
            subButton,
            points,
            addButton,
            container: DElementBuilder.initDiv()
                .setAttribute(ATTRIBUTES.CLASS, CSS.NOWRAP)
                .appendChilds(
                    subButton.getElement(),
                    points.map(p => p.getElement()),
                    addButton.getElement(),
                ).create(),
        };
    }

    getElement() {
        return this.inner.container;
    }

    getSubButton() {
        return this.inner.subButton;
    }

    getAddButton() {
        return this.inner.addButton;
    }

    setValue(disabled, active) {
        for (const point of this.inner.points) {
            point.setEmpty();
        }

        for (let i = 0; i < disabled; i++) {
            this.inner.points[i]?.setDisable();
        }

        for (let i = 0; i < active; i++) {
            this.inner.points[disabled + i]?.setActive();
        }
    }
}

export class UI_Text {
    constructor(text, wrapAttrubutes = {}) {
        this.inner = { element: DElementBuilder.initDiv(wrapAttrubutes).create(), };
        this.inner.element.setText(text);
    }

    getElement() {
        return this.inner.element;
    }

    setText(text) {
        this.inner.element.setText(text);
    }

    setVisible(isVisible) {
        this.inner.element.setVisible(isVisible);
    }
}

export class UI_TextList {
    constructor() {
        const list = DElementBuilder.initUnorderedList().create();
        const container = DElementBuilder.initDiv()
            .appendChilds(list).create();

        this.inner = { list, container, };
    }

    getElement() {
        return this.inner.container;
    }

    addItem(text, itemAttrubutes = {}) {
        const item = DElementBuilder.initListItem(itemAttrubutes)
            .appendChilds(text).create();
        this.inner.list.appendChilds(item);
    }

    clear() {
        this.inner.list.setText(EMPTY_STRING);
    }
}

export class UI_Dropdown {
    constructor({ selectAttrubutes = {}, addEmptyOption = false, emptyOptionAttrubutes = {}, defaultOptions = [] } = {}) {
        const element = DElementBuilder.initSelect(selectAttrubutes).create();

        this.inner = { element };

        if (addEmptyOption) {
            this.addOption(EMPTY_STRING, emptyOptionAttrubutes);
        }

        for (const option of defaultOptions) {
            this.addOption(option.text, option.attrubutes);
        }
    }

    getElement() {
        return this.inner.element;
    }

    clear() {
        this.inner.element.setText(EMPTY_STRING);
    }

    addOption(text, optionAttrubutes = {}) {
        const optionElement = DElementBuilder.initOption(optionAttrubutes)
            .appendChilds(text).create();
        this.inner.element.appendChilds(optionElement);
    }

    setOnChangeEvent(handler) {
        this.inner.element.setEventHandler(EVENTS.CHANGE, handler);
    }

    setActive(isActive) {
        this.inner.element.setActive(isActive);
    }

    setVisible(isVisible) {
        this.inner.element.setVisible(isVisible);
    }
}

const InputType = Object.freeze({
    Text: 'text',
    Number: 'number',
    CheckBox: 'checkbox',
});

const SIMPLE_TO_NUMBER_MAPPER = value => +value;

class UI_Input_Base {
    constructor(inputBuilder) {
        const input = DElementBuilder.use(inputBuilder).create();
        const container = DElementBuilder.initDiv()
            .appendChilds(input).create();

        this.inner = { input, container, };
    }

    getElement() {
        return this.inner.container;
    }

    getValue() {
        return this.inner.input.getValue();
    }

    setValue(value) {
        return this.inner.input.setValue(value);
    }

    setReadOnly(isReadOnly) {
        this.inner.input.setReadOnly(isReadOnly);
    }

    setVisible(isVisible) {
        this.inner.container.setVisible(isVisible);
    }

    setActive(isActive) {
        this.inner.input.setActive(isActive);
    }

    setOnInputEvent(handler) {
        this.inner.input.setEventHandler(EVENTS.INPUT, handler);
    }
}

export class UI_Input_Text extends UI_Input_Base {
    constructor(size = undefined) {
        const inputBuilder = DElementBuilder.initInput()
            .setAttribute(ATTRIBUTES.TYPE, InputType.Text);

        if (size) {
            inputBuilder.setAttribute(ATTRIBUTES.SIZE, size);
        }

        super(inputBuilder);
    }
}

export class UI_Input_Number extends UI_Input_Base {
    constructor(min = undefined, max = undefined, inputStyle = undefined) {
        const inputBuilder = DElementBuilder.initInput()
            .setAttribute(ATTRIBUTES.TYPE, InputType.Number);

        if (min) {
            inputBuilder.setAttribute(ATTRIBUTES.MIN, min);
        }

        if (max) {
            inputBuilder.setAttribute(ATTRIBUTES.MAX, max);
        }

        if (inputStyle) {
            inputBuilder.setAttribute(ATTRIBUTES.STYLE, inputStyle);
        }

        inputBuilder.setMapper(ACTIONS.GET, SIMPLE_TO_NUMBER_MAPPER);
        inputBuilder.setMapper(ACTIONS.SET, SIMPLE_TO_NUMBER_MAPPER);

        super(inputBuilder);
    }
}

export class UI_Input_СheckBox extends UI_Input_Base {
    constructor() {
        const inputBuilder = DElementBuilder.initInput()
            .setAttribute(ATTRIBUTES.TYPE, InputType.CheckBox);

        super(inputBuilder);
    }

    getValue() {
        return this.inner.input.getAttribute(ATTRIBUTES.CHECKED);
    }

    setValue(value) {
        return this.inner.input.setAttribute(ATTRIBUTES.CHECKED, value);
    }
}

export class UI_Input_TextOrText extends UI_Input_Base {
    constructor(isInput, inputConfig = {}) {
        if (isInput) {
            const inputBuilder = DElementBuilder.initInput()
                .setAttribute(ATTRIBUTES.TYPE, InputType.Text);

            const { size } = inputConfig;

            if (size) {
                inputBuilder.setAttribute(ATTRIBUTES.SIZE, size);
            }

            super(inputBuilder);
        } else {
            const inputBuilder = DElementBuilder.initDiv();

            super(inputBuilder);

            this.getValue = function () {
                return this.inner.input.getText();
            };

            this.setValue = function (value) {
                return this.inner.input.setText(value);
            };
        }
    }
}

export class UI_Input_TextOrNumber extends UI_Input_Base {
    constructor(isInput, inputConfig = {}) {
        if (isInput) {
            const inputBuilder = DElementBuilder.initInput()
                .setAttribute(ATTRIBUTES.TYPE, InputType.Number);

            const { min, max, inputStyle } = inputConfig;

            if (min) {
                inputBuilder.setAttribute(ATTRIBUTES.MIN, min);
            }

            if (max) {
                inputBuilder.setAttribute(ATTRIBUTES.MAX, max);
            }

            if (inputStyle) {
                inputBuilder.setAttribute(ATTRIBUTES.STYLE, inputStyle);
            }

            inputBuilder.setMapper(ACTIONS.GET, SIMPLE_TO_NUMBER_MAPPER);
            inputBuilder.setMapper(ACTIONS.SET, SIMPLE_TO_NUMBER_MAPPER);

            super(inputBuilder);
        } else {
            const inputBuilder = DElementBuilder.initDiv();

            super(inputBuilder);

            this.getValue = function () {
                const value = this.inner.input.getText();
                return SIMPLE_TO_NUMBER_MAPPER(value);
            };

            this.setValue = function (value) {
                const mappedValue = SIMPLE_TO_NUMBER_MAPPER(value);
                return this.inner.input.setText(mappedValue);
            };
        }
    }
}

export class UI_Input_TextOrTextArea extends UI_Input_Base {
    constructor(isInput, inputConfig = {}) {
        if (isInput) {
            const inputBuilder = DElementBuilder.initTextArea();

            const { cols, rows } = inputConfig;

            if (cols) {
                inputBuilder.setAttribute(ATTRIBUTES.COLS, cols);
            }

            if (rows) {
                inputBuilder.setAttribute(ATTRIBUTES.ROWS, rows);
            }

            super(inputBuilder);
        } else {
            const inputBuilder = DElementBuilder.initDiv();

            super(inputBuilder);

            this.getValue = function () {
                return this.inner.input.getText();
            };

            this.setValue = function (value) {
                return this.inner.input.setText(value);
            };
        }
    }
}