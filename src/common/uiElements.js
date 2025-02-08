import { DElementBuilder, ATTRIBUTES, EVENTS, ACTIONS } from './domWrapper.js'
import { SVGIcons } from './svg.js'

const EMPTY_STRING = '';

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