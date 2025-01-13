import { HTMLTags, render } from './render.js'
import { SVGIcons } from './svg.js'

const CSS = Object.freeze({
    HIDDEN: 'hidden',
});

export const UITextInputType = Object.freeze({
    Text: 'text',
    Number: 'number',
});

export class UITextInput {
    constructor(wrapAttrubutes = {}, type = UITextInputType.Text, min = undefined, max = undefined) {
        this.input = render(HTMLTags.Input, { type, min, max });
        this.element = render(HTMLTags.Div, wrapAttrubutes, this.input);

        this.isVisible = true;
    }

    getValue() {
        return this.input.value;
    }

    setVisible(isVisible) {
        this.isVisible = isVisible;
        if (isVisible) {
            this.element.classList.remove(CSS.HIDDEN);
        } else {
            this.element.classList.add(CSS.HIDDEN);
        }
    }
}

export class UIText {
    constructor(text, wrapAttrubutes) {
        this.element = render(HTMLTags.Div, wrapAttrubutes, text);
    }

    setText(text) {
        this.element.innerHTML = text;
    }
}

export class UIIcon {
    constructor(baseImage) {
        this.element = render(HTMLTags.Img, { src: baseImage });
    }

    setImage(image) {
        this.element.src = image;
    }
}

export class UIPoint extends UIIcon {
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

export class UIButton extends UIIcon {
    constructor(enableImage, disableImage) {
        super(enableImage);

        this.enableImage = enableImage;
        this.disableImage = disableImage;

        this.isVisible = true;
        this.isActive = true;
        this.onClickFunc = undefined;

        const instance = this;
        this.element.onclick = function () {
            if (instance.isActive && instance.onClickFunc) {
                instance.onClickFunc();
            }
        }
    }

    setActive(isActive) {
        this.isActive = isActive;
        this.setImage(isActive ? this.enableImage : this.disableImage);
    }

    setVisible(isVisible) {
        this.isVisible = isVisible;
        if (isVisible) {
            this.element.classList.remove(CSS.HIDDEN);
        } else {
            this.element.classList.add(CSS.HIDDEN);
        }
    }

    setOnClickEvent(func) {
        this.onClickFunc = func;
    }
}

export class UIPointsLine {
    constructor(pointsCount, showButtons, wrapAttrubutes = {}) {
        this.pointsCount = pointsCount;

        this.subButton = new UIButton(SVGIcons.BUTTON_SUB_ENABLED, SVGIcons.BUTTON_SUB_DISABLED);
        this.points = Array.from(Array(pointsCount)).map(_ => new UIPoint());
        this.addButton = new UIButton(SVGIcons.BUTTON_ADD_ENABLED, SVGIcons.BUTTON_ADD_DISABLED);

        this.subButton.setVisible(showButtons);
        this.addButton.setVisible(showButtons);

        this.element = render(
            HTMLTags.Div,
            wrapAttrubutes,
            this.subButton.element,
            this.points.map(e => e.element),
            this.addButton.element,
        );
    }

    setValue(disabled, active) {
        for (const point of this.points) {
            point.setEmpty();
        }

        for (let i = 0; i < disabled; i++) {
            this.points[i]?.setDisable();
        }

        for (let i = 0; i < active; i++) {
            this.points[disabled + i]?.setActive();
        }
    }
}