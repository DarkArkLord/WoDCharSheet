import { DElementBuilder, ATTRIBUTES, EVENTS, ACTIONS } from './domWrapper.js'
import { SVGIcons } from './svg.js'

const EMPTY_STRING = '';

const CSS = Object.freeze({
    NOWRAP: 'nowrap',
});

export class UIIcon {
    constructor(baseImage) {
        this.private = {
            element: DElementBuilder.initImg()
                .setAttribute(ATTRIBUTES.SRC, baseImage)
                .create(),
        };
    }

    getElement() {
        return this.private.element;
    }

    setImage(image) {
        this.private.element.setAttribute(ATTRIBUTES.SRC, image);
    }
}

export class UIIconPoint extends UIIcon {
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

export class UIIconButton extends UIIcon {
    constructor(enableImage, disableImage) {
        super(enableImage);

        this.private.enableImage = enableImage;
        this.private.disableImage = disableImage;
    }

    setActive(isActive) {
        this.private.element.setActive(isActive);
        this.setImage(isActive ? this.private.enableImage : this.private.disableImage);
    }

    setVisible(isVisible) {
        this.private.element.setVisible(isVisible);
    }

    setOnClickEvent(func) {
        this.private.element.setEventHandler(EVENTS.CLICK, func);
    }
}

export class UIPointsLine {
    constructor(pointsCount, showButtons) {
        const subButton = new UIIconButton(SVGIcons.BUTTON_SUB_ENABLED, SVGIcons.BUTTON_SUB_DISABLED);
        const points = Array.from(Array(pointsCount)).map(_ => new UIIconPoint());
        const addButton = new UIIconButton(SVGIcons.BUTTON_ADD_ENABLED, SVGIcons.BUTTON_ADD_DISABLED);

        subButton.setVisible(showButtons);
        addButton.setVisible(showButtons);

        this.private = {
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
        return this.private.container;
    }

    getSubButton() {
        return this.private.subButton;
    }

    getAddButton() {
        return this.private.addButton;
    }

    setValue(disabled, active) {
        for (const point of this.private.points) {
            point.setEmpty();
        }

        for (let i = 0; i < disabled; i++) {
            this.private.points[i]?.setDisable();
        }

        for (let i = 0; i < active; i++) {
            this.private.points[disabled + i]?.setActive();
        }
    }
}

export class UIText {
    constructor(text, wrapAttrubutes = {}) {
        this.private = { element: DElementBuilder.initDiv(wrapAttrubutes).create(), };
        this.private.element.setText(text);
    }

    getElement() {
        return this.private.element;
    }

    setText(text) {
        this.private.element.setText(text);
    }

    setVisible(isVisible) {
        this.private.element.setVisible(isVisible);
    }
}

export class UITextList {
    constructor() {
        const list = DElementBuilder.initUnorderedList().create();
        const container = DElementBuilder.initDiv()
            .appendChilds(list).create();

        this.private = { list, container, };
    }

    getElement() {
        return this.private.container;
    }

    addItem(text, itemAttrubutes = {}) {
        const item = DElementBuilder.initListItem(itemAttrubutes)
            .appendChilds(text).create();
        this.private.list.appendChilds(item);
    }

    clear() {
        this.private.list.setText(EMPTY_STRING);
    }
}

export class UIDropdown {
    constructor({ selectAttrubutes = {}, addEmptyOption = false, emptyOptionAttrubutes = {}, defaultOptions = [] } = {}) {
        const element = DElementBuilder.initSelect(selectAttrubutes).create();

        this.private = { element };

        if (addEmptyOption) {
            this.addOption(EMPTY_STRING, emptyOptionAttrubutes);
        }

        for (const option of defaultOptions) {
            this.addOption(option.text, option.attrubutes);
        }
    }

    getElement() {
        return this.private.element;
    }

    clear() {
        this.private.element.setText(EMPTY_STRING);
    }

    addOption(text, optionAttrubutes = {}) {
        const optionElement = DElementBuilder.initOption(optionAttrubutes)
            .appendChilds(text).create();
        this.private.element.appendChilds(optionElement);
    }

    setOnChangeEvent(handler) {
        this.private.element.setEventHandler(EVENTS.CHANGE, handler);
    }

    setActive(isActive) {
        this.private.element.setActive(isActive);
    }

    setVisible(isVisible) {
        this.private.element.setVisible(isVisible);
    }
}

const InputType = Object.freeze({
    Text: 'text',
    Number: 'number',
});

const SIMPLE_TO_NUMBER_MAPPER = value => +value;

class UIBaseInput {
    constructor(inputBuilder) {
        const input = DElementBuilder.use(inputBuilder).create();
        const container = DElementBuilder.initDiv()
            .appendChilds(input).create();

        this.private = { input, container, };
    }

    getElement() {
        return this.private.container;
    }

    getValue() {
        return this.private.input.getValue();
    }

    setValue(value) {
        return this.private.input.setValue(value);
    }

    setReadOnly(isReadOnly) {
        this.private.input.setReadOnly(isReadOnly);
    }

    setVisible(isVisible) {
        this.private.container.setVisible(isVisible);
    }

    setActive(isActive) {
        this.private.input.setActive(isActive);
    }

    setOnInputEvent(handler) {
        this.private.input.setEventHandler(EVENTS.INPUT, handler);
    }
}

export class UITextInput extends UIBaseInput {
    constructor(size = undefined) {
        const inputBuilder = DElementBuilder.initInput()
            .setAttribute(ATTRIBUTES.TYPE, InputType.Text);

        if (size) {
            inputBuilder.setAttribute(ATTRIBUTES.SIZE, size);
        }

        super(inputBuilder);
    }
}

export class UINumberInput extends UIBaseInput {
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

export class UITextOrTextInput extends UIBaseInput {
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
                return this.private.input.getText();
            };

            this.setValue(value) = function (value) {
                return this.private.input.setText(value);
            };
        }
    }
}

export class UITextOrNumberInput extends UIBaseInput {
    constructor(isInput, inputConfig = {}) {
        if (isInput) {
            const inputBuilder = DElementBuilder.initInput()
                .setAttribute(ATTRIBUTES.TYPE, InputType.Text);

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
                const value = this.private.input.getText();
                return SIMPLE_TO_NUMBER_MAPPER(value);
            };

            this.setValue(value) = function (value) {
                const mappedValue = SIMPLE_TO_NUMBER_MAPPER(value);
                return this.private.input.setText(mappedValue);
            };
        }
    }
}
