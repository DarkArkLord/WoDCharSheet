import { DElementBuilder, ATTRIBUTES, EVENTS, ACTIONS } from './domWrapper.js'
import { SVGIcons } from './svg.js'

const EMPTY_STRING = '';

export class UIIcon {
    constructor(baseImage) {
        this._ = {
            element: DElementBuilder.initImg()
                .setAttribute(ATTRIBUTES.SRC, baseImage)
                .create(),
        };
    }

    getElement() {
        return this._.element.getElement();
    }

    setImage(image) {
        this._.element.setAttribute(ATTRIBUTES.SRC, image);
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

        this._.enableImage = enableImage;
        this._.disableImage = disableImage;
    }

    setActive(isActive) {
        this._.element.setActive(isActive);
        this.setImage(isActive ? this._.enableImage : this._.disableImage);
    }

    setVisible(isVisible) {
        this._.element.setVisible(isVisible);
    }

    setOnClickEvent(func) {
        this._.element.setEventHandler(EVENTS.CLICK, func);
    }
}