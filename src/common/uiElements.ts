import { HTMLTags, render } from './render'
import { SVGIcons } from './svg'

const EMPTY_STRING = '';

const CSS = Object.freeze({
    HIDDEN: 'hidden',
});

export const UITextInputType = Object.freeze({
    Text: 'text',
    Number: 'number',
});

export class UITextInput {
    protected input: HTMLInputElement;
    public element: HTMLElement;

    protected isVisible: boolean;
    protected isActive: boolean;

    protected onChangedFunc: Function;

    constructor(wrapAttrubutes = {}, type = UITextInputType.Text, min: number = undefined, max: number = undefined, size: number = undefined, inputStyle: string = undefined) {
        const instance = this;

        this.input = render(HTMLTags.Input, { type, min, max, size, style: inputStyle }) as HTMLInputElement;
        this.element = render(HTMLTags.Div, wrapAttrubutes, this.input);

        this.isVisible = true;
        this.isActive = true;
        this.onChangedFunc = undefined;

        this.element.oninput = function () {
            if (instance.isActive && instance.onChangedFunc) {
                instance.onChangedFunc();
            }
        }
    }

    getValue() {
        return this.input.value; // valueAsNumber
    }

    setValue(text: string) {
        this.input.value = text;
    }

    setReadOnly(isReadOnly: boolean) {
        this.input.readOnly = isReadOnly;
        this.input.disabled = isReadOnly;
    }

    setVisible(isVisible: boolean) {
        this.isVisible = isVisible;
        if (isVisible) {
            this.element.classList.remove(CSS.HIDDEN);
        } else {
            this.element.classList.add(CSS.HIDDEN);
        }
    }

    setActive(isActive: boolean) {
        this.isActive = isActive;
    }

    setOnChangedEvent(func: Function) {
        this.onChangedFunc = func;
    }
}

export class UIText {
    public element: HTMLElement;

    protected isVisible: boolean;

    constructor(text: string, wrapAttrubutes: any) {
        this.element = render(HTMLTags.Div, wrapAttrubutes, text);

        this.isVisible = true;
    }

    setText(text: string) {
        this.element.innerHTML = text;
    }

    setVisible(isVisible: boolean) {
        this.isVisible = isVisible;
        if (isVisible) {
            this.element.classList.remove(CSS.HIDDEN);
        } else {
            this.element.classList.add(CSS.HIDDEN);
        }
    }
}

export class UIIcon {
    public element: HTMLImageElement;

    constructor(baseImage: string) {
        this.element = render(HTMLTags.Img, { src: baseImage }) as HTMLImageElement;
    }

    setImage(image: string) {
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
    protected enableImage: string;
    protected disableImage: string;

    protected isVisible: boolean;
    protected isActive: boolean;

    protected onClickFunc: Function;

    constructor(enableImage: string, disableImage: string) {
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

    setActive(isActive: boolean) {
        this.isActive = isActive;
        this.setImage(isActive ? this.enableImage : this.disableImage);
    }

    setVisible(isVisible: boolean) {
        this.isVisible = isVisible;
        if (isVisible) {
            this.element.classList.remove(CSS.HIDDEN);
        } else {
            this.element.classList.add(CSS.HIDDEN);
        }
    }

    setOnClickEvent(func: Function) {
        this.onClickFunc = func;
    }
}

export class UIPointsLine {
    protected pointsCount: number;

    protected subButton: UIButton;
    protected points: Array<UIPoint>;
    protected addButton: UIButton;

    public element: HTMLElement;

    constructor(pointsCount: number, showButtons: boolean, wrapAttrubutes: any = {}) {
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

    setValue(disabled: number, active: number) {
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

export class UITextList {
    protected listElement: HTMLElement;
    public element: HTMLElement;

    constructor(wrapAttrubutes = {}) {
        this.listElement = render(HTMLTags.UnorderedList, {});
        this.element = render(HTMLTags.Div, wrapAttrubutes, this.listElement);
    }

    addItem(text: string, itemAttrubutes: any = {}) {
        const item = render(HTMLTags.ListItem, itemAttrubutes, text);
        this.listElement.append(item);
    }

    clear() {
        this.listElement.innerHTML = '';
    }
}

export class UIDropdown {
    public element: HTMLElement;

    protected isVisible: boolean;
    protected isActive: boolean;

    protected onChangeEvent: Function;

    constructor(selectAttrubutes = {}, { addEmptyOption = false, emptyOptionAttrubutes = {}, defaultOptions = [] } = {}) {
        const instance = this;

        this.element = render(HTMLTags.Select, selectAttrubutes);

        this.isVisible = true;
        this.isActive = true;
        this.onChangeEvent = undefined;

        this.element.onchange = function (input) {
            if (instance.isActive && instance.onChangeEvent) {
                instance.onChangeEvent(input);
            }
        }

        if (addEmptyOption) {
            this.addOption(EMPTY_STRING, emptyOptionAttrubutes);
        }

        for (const option of defaultOptions) {
            this.addOption(option.text, option.attrubutes);
        }
    }

    clear() {
        this.element.innerHTML = '';
    }

    addOption(text: string, optionAttrubutes = {}) {
        const optionElement = render(HTMLTags.Option, optionAttrubutes, text);
        this.element.append(optionElement);
    }

    setOnChangeEvent(func: Function) {
        this.onChangeEvent = func;
    }

    setActive(isActive: boolean) {
        this.isActive = isActive;
    }

    setVisible(isVisible: boolean) {
        this.isVisible = isVisible;
        if (isVisible) {
            this.element.classList.remove(CSS.HIDDEN);
        } else {
            this.element.classList.add(CSS.HIDDEN);
        }
    }
}