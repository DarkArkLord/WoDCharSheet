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
        return this.private.element.getElement();
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
        return this.private.container.getElement();
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