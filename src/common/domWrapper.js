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

    appendChild(child) {
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

export class DarkHtmlElement {
    constructor(tag, attr, ...childs) {
        this.private = {
            wrapper: new DarkHtmlWrapper(tag, attr, ...childs),
            isActive: true,
            events: {},
            mappers: {},
        };
    }

    getElement() {
        return this.private.wrapper.element;
    }

    setVisible(isVisible) {
        if (isVisible) {
            this.private.wrapper.removeClass(CSS.HIDDEN);
        } else {
            this.private.wrapper.addClass(CSS.HIDDEN);
        }
    }

    setReadOnly(isReadOnly) {
        this.private.wrapper.setAttribute(ATTRIBUTES.READ_ONLY, isReadOnly);
        this.private.wrapper.setAttribute(ATTRIBUTES.DISABLED, isReadOnly);
    }

    setActive(isActive) {
        this.private.isActive = isActive;
    }

    setEventHandler(eventName, eventHandler) {
        const instance = this.private;
        instance.events[eventName] = eventHandler;

        if (!instance.wrapper.getAttribute(eventName)) {
            instance.wrapper.setAttribute(eventName, function (input) {
                const handler = instance.events[eventName];
                if (instance.isActive && handler) {
                    handler(input);
                }
            });
        }
    }

    getText() {
        return this.private.wrapper.getAttribute(ATTRIBUTES.INNER_HTML);
    }
    setText(text) {
        this.private.wrapper.setAttribute(ATTRIBUTES.INNER_HTML, text);
    }

    getValue() {
        const value = this.private.wrapper.getAttribute(ATTRIBUTES.VALUE);
        const mapper = this.private.mappers[ACTIONS.GET];
        return mapper ? mapper(value) : value;
    }
    setValue(text) {
        const mapper = this.private.mappers[ACTIONS.SET];
        if (mapper) {
            text = mapper(text);
        }
        this.private.wrapper.setAttribute(ATTRIBUTES.VALUE, text);
    }
    setValueMapper(action, mapper) {
        this.private.mappers[action] = mapper;
    }

    appendChild(child) {
        this.private.wrapper.appendChild(child);
    }
}
