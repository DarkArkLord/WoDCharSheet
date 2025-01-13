import { SVGIcons } from '../common/svg.js'
import { HTMLTags, render } from '../common/render.js'
import { UITextInputType, UITextInput, UIText, UIIcon, UIPointsLine } from '../common/uiElementsBase.js'

export class CharAttributes {
    constructor(attributesKeeper, attributeInfo, valudations, state) {
        this.stateInfo = valudations[state];
        this.validations = this.stateInfo?.attributes;
        this.data = attributesKeeper[attributeInfo.id] = attributesKeeper[attributeInfo.id] ?? {};

        if (this.data[state] === undefined) {
            this.data[state] = this.validations?.min ?? 0;
        }
    }
}