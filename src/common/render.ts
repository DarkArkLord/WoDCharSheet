declare namespace Render {
    type TChild = HTMLElement | string;
    type TChildToAdd = TChild | Array<TChild | TChildToAdd>;
    type TChilds = Array<TChild>;
    type TTag = string | Function
}

export const HTMLTags = Object.freeze({
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
});

export function render(tag: Render.TTag, attributes?: any, ...childs: Render.TChilds) {
    if (tag instanceof Function) {
        return tag(attributes, ...childs);
    }

    const element: HTMLElement = document.createElement(tag);

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

function addChild(parent: HTMLElement, child: Render.TChildToAdd): void {
    if (Array.isArray(child)) {
        for (const innerChild of child) {
            addChild(parent, innerChild);
        }
    } else {
        parent.appendChild(
            child instanceof HTMLElement
                ? child
                : document.createTextNode(child)
        );
    }
}