import { HTMLTags, render } from './render.js'

const EMPTY_STRING = '';

const CSS = Object.freeze({
    HIDDEN: 'hidden',
});

export const ATTRIBUTES = Object.freeze({
    READ_ONLY: 'readOnly',
    DISABLED: 'disabled',
    INNER_HTML: 'innerHTML',
    VALUE: 'value',
    SRC: 'src',
    TYPE: 'type',
    MIN: 'min',
    MAX: 'max',
    SIZE: 'size',
    STYLE: 'style',
    CLASS: 'class',
});

export const EVENTS = Object.freeze({
    CHANGE: 'onchange',
    INPUT: 'oninput',
    CLICK: 'onclick',
});

export const ACTIONS = Object.freeze({
    GET: 'get',
    SET: 'set',
});

export class DarkHtmlElement {
    constructor(tag, { attributes = {}, isActive = true, events = {}, mappers = {} } = {}, ...childs) {
        this.private = {
            element: render(tag, attributes, ...childs),
            isActive,
            events,
            mappers,
        };
    }

    getElement() {
        return this.private.element;
    }

    addClass(className) {
        this.private.element.classList.add(className);
    }
    removeClass(className) {
        this.private.element.classList.remove(className);
    }
    setVisible(isVisible) {
        if (isVisible) {
            this.removeClass(CSS.HIDDEN);
        } else {
            this.addClass(CSS.HIDDEN);
        }
    }

    getAttribute(attr) {
        return this.private.element[attr];
    }
    setAttribute(attr, value) {
        this.private.element[attr] = value;
    }
    setReadOnly(isReadOnly) {
        this.setAttribute(ATTRIBUTES.READ_ONLY, isReadOnly);
        this.setAttribute(ATTRIBUTES.DISABLED, isReadOnly);
    }

    setActive(isActive) {
        this.private.isActive = isActive;
    }

    setEventHandler(eventName, eventHandler) {
        const instance = this.private;
        instance.events[eventName] = eventHandler;

        if (!this.getAttribute(eventName)) {
            this.setAttribute(eventName, function (input) {
                const handler = instance.events[eventName];
                if (instance.isActive && handler) {
                    handler(input);
                }
            });
        }
    }

    getText() {
        return this.getAttribute(ATTRIBUTES.INNER_HTML);
    }
    setText(text) {
        this.setAttribute(ATTRIBUTES.INNER_HTML, text);
    }

    getValue() {
        const value = this.getAttribute(ATTRIBUTES.VALUE);
        const mapper = this.private.mappers[ACTIONS.GET];
        return mapper ? mapper(value) : value;
    }
    setValue(text) {
        const mapper = this.private.mappers[ACTIONS.SET];
        if (mapper) {
            text = mapper(text);
        }
        this.setAttribute(ATTRIBUTES.VALUE, text);
    }
    setValueMapper(action, mapper) {
        this.private.mappers[action] = mapper;
    }

    appendChilds(...childs) {
        for (const child of childs) {
            let temp = child;

            if (child instanceof DarkHtmlElement) {
                temp = child.getElement();
            } else if (!(child instanceof HTMLElement || child instanceof SVGElement)) {
                temp = document.createTextNode(child);
            }

            this.private.element.appendChild(temp);
        }
    }
}

export class DElementBuilder {
    constructor(tag, attributes) {
        this.tag = tag;
        this.attributes = attributes ?? {};
        this.events = {};
        this.mappers = {};
        this.childs = [];
    }

    static init(tag, attributes = {}) {
        return new DElementBuilder(tag, attributes);
    }

    static use(other) {
        const builder = new DElementBuilder();

        builder.tag = other.tag;
        builder.attributes = other.attributes;
        builder.events = other.events;
        builder.mappers = other.mappers;
        builder.childs = other.childs;

        return builder;
    }

    static initDiv(attributes = {}) {
        return DElementBuilder.init(HTMLTags.Div, attributes);
    }

    static initInput(attributes = {}) {
        return DElementBuilder.init(HTMLTags.Input, attributes);
    }

    static initImg(attributes = {}) {
        return DElementBuilder.init(HTMLTags.Img, attributes);
    }

    static initUnorderedList(attributes = {}) {
        return DElementBuilder.init(HTMLTags.UnorderedList, attributes);
    }

    static initListItem(attributes = {}) {
        return DElementBuilder.init(HTMLTags.ListItem, attributes);
    }

    static initSelect(attributes = {}) {
        return DElementBuilder.init(HTMLTags.Select, attributes);
    }

    static initOption(attributes = {}) {
        return DElementBuilder.init(HTMLTags.Option, attributes);
    }

    setTag(tag) {
        this.tag = tag;
        return this;
    }

    setAttribute(attribute, value) {
        this.attributes[attribute] = value;
        return this;
    }

    setEvent(eventName, handler) {
        this.events[eventName] = handler;
        return this;
    }

    setMapper(action, mapper) {
        this.mappers[action] = mapper;
        return this;
    }

    appendChilds(...childs) {
        this.childs.push(...childs);
        return this;
    }

    create() {
        const result = new DarkHtmlElement(this.tag, {
            attributes: this.attributes,
            events: this.events,
            mappers: this.mappers,
        });
        result.appendChilds(this.childs);
        return result;
    }
}