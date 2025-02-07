export const HTMLTags = {
    Table: 'table',
    TableRow: 'tr',
    TableData: 'td',
    Div: 'div',
    Img: 'img',
    Input: 'input',
    TextArea: 'textarea',
    UnorderedList: 'ul',
    ListItem: 'li',
    Select: 'select',
    Option: 'option',
};

export function render(tag, attributes, ...childs) {
    if (tag instanceof Function) {
        return tag(attributes, ...childs);
    }

    const element = document.createElement(tag);

    if (attributes) {
        for (const name in attributes) {
            let value = attributes[name];
            element.setAttribute(name, value);
        }
    }

    for (const child of childs) {
        addChild(element, child);
    }

    return element;
}

export const SVGTags = Object.freeze({
    SVG: 'svg',
    Group: 'g',
    Circle: 'circle',
    Line: 'line',
    Rect: 'rect',
});

export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export function renderSVG(tag, attributes, ...childs) {
    if (tag instanceof Function) {
        return tag(attributes, ...childs);
    }

    const element = document.createElementNS(SVG_NAMESPACE, tag);

    if (attributes) {
        for (const name in attributes) {
            const value = attributes[name];
            // element.setAttributeNS(null, name, value);
            element.setAttribute(name, value);
        }
    }

    for (const child of childs) {
        addChild(element, child);
    }

    return element;
}

function addChild(parent, child) {
    if (Array.isArray(child)) {
        for (const innerChild of child) {
            addChild(parent, innerChild);
        }
    } else {
        parent.appendChild(
            child instanceof HTMLElement || child instanceof SVGElement
                ? child
                : document.createTextNode(child)
        );
    }
}