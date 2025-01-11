import { HTMLTags, render } from './render.js'
import { SVGIcons } from './svg.js'

class UIIcon {
    constructor(baseImage) {
        this.element = render(HTMLTags.Img, { src: baseImage });
    }

    setImage(image) {
        this.element.src = image;
    }

    getOnClickEvent() {
        return this.element.onclick;
    }
    setOnClickEvent(func) {
        this.element.onclick = func;
    }
}

export class UIPointsLine {
    constructor(pointsCount) {
        this.pointsCount = pointsCount;

        this.subButton = new UIIcon(SVGIcons.BUTTON_SUB_ENABLED);
        this.points = Array.from(Array(pointsCount)).map(_ => new UIIcon(SVGIcons.POINT_EMPTY));
        this.addButton = new UIIcon(SVGIcons.BUTTON_ADD_ENABLED);

        this.element = render(
            HTMLTags.Div,
            {},
            this.subButton.element,
            this.points.map(e => e.element),
            this.addButton.element,
        );
    }
}