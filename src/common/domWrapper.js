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
    TYPE: 'type',
    MIN: 'min',
    MAX: 'max',
    SIZE: 'size',
    STYLE: 'style',
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

class DarkHtmlWrapper {
    constructor(tag, attr, ...childs) {
        this.element = render(tag, attr, ...childs);
    }

    addClass(className) {
        this.element.classList.add(className);
    }
    removeClass(className) {
        this.element.classList.remove(className);
    }

    getAttribute(attr) {
        return this.element[attr];
    }
    setAttribute(attr, value) {
        this.element[attr] = value;
    }

    appendChilds(...childs) {
        for (let child of childs) {
            if (child instanceof DarkHtmlWrapper) {
                child = child.element;
            } else if (child instanceof DarkHtmlElement) {
                child = child.getElement();
            } else if (!(child instanceof HTMLElement || child instanceof SVGElement)) {
                child = document.createTextNode(child);
            }

            this.element.appendChild(child);
        }
    }
}

export class DarkHtmlElement {
    constructor(tag, { attributes = {}, isActive = true, events = {}, mappers = {} } = {}, ...childs) {
        this.private = {
            wrapper: new DarkHtmlWrapper(tag, attributes, ...childs),
            isActive,
            events,
            mappers,
        };
    }

    getElement() {
        return this.private.wrapper.element;
    }

    addClass(className) {
        this.private.wrapper.addClass(className);
    }
    removeClass(className) {
        this.private.wrapper.removeClass(className);
    }
    setVisible(isVisible) {
        if (isVisible) {
            this.removeClass(CSS.HIDDEN);
        } else {
            this.addClass(CSS.HIDDEN);
        }
    }

    setAttribute(attr, value) {
        this.private.wrapper.setAttribute(attr, value);
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
        this.private.wrapper.appendChilds(...childs);
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