import { HTMLTags, render } from './render.js'
import { SVGIcons } from './svg.js'

const HIDDEN_ELEMENT_CLASS = 'hidden';

class UIIcon {
    constructor(baseImage) {
        this.element = render(HTMLTags.Img, { src: baseImage });
    }

    setImage(image) {
        this.element.src = image;
    }
}

class UIPoint extends UIIcon {
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

class UIButton extends UIIcon {
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
            this.element.classList.remove(HIDDEN_ELEMENT_CLASS);
        } else {
            this.element.classList.add(HIDDEN_ELEMENT_CLASS);
        }
    }

    setOnClickEvent(func) {
        this.onClickFunc = func;
    }
}

export class UIPointsLine {
    constructor(pointsCount) {
        this.pointsCount = pointsCount;

        this.subButton = new UIButton(SVGIcons.BUTTON_SUB_ENABLED, SVGIcons.BUTTON_SUB_DISABLED);
        this.points = Array.from(Array(pointsCount)).map(_ => new UIPoint());
        this.addButton = new UIButton(SVGIcons.BUTTON_ADD_ENABLED, SVGIcons.BUTTON_ADD_DISABLED);

        this.element = render(
            HTMLTags.Div,
            {},
            this.subButton.element,
            this.points.map(e => e.element),
            this.addButton.element,
        );
    }
}