import { HTMLTags, render } from './render.js'

const EMPTY_STRING = '';

const CSS = Object.freeze({
    HIDDEN: 'hidden',
});

const ATTRIBUTES = Object.freeze({
    READ_ONLY: 'readOnly',
    DISABLED: 'disabled',
});

const EVENTS = Object.freeze({
    CHANGE: 'onchange',
    INPUT: 'oninput',
    CLICK: 'onclick',
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

class DarkHtmlElement {
    constructor(tag, attr, ...childs) {
        this.private = {
            wrapper: new DarkHtmlWrapper(tag, attr, ...childs),
            isActive: true,
            events: {},
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
}
