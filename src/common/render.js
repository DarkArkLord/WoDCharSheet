export const HTMLTags = {
    Table: 'table',
    TableRow: 'tr',
    TableData: 'td',
    Div: 'div',
    Img: 'img',
    Input: 'input',
    UnorderedList: 'ul',
    ListItem: 'li',
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
        (function addChild(parent, child) {
            if (Array.isArray(child)) {
                for (const innerChild of child) {
                    addChild(parent, innerChild);
                }
            } else {
                parent.appendChild(
                    typeof child == 'number' || typeof child == 'string'
                        ? document.createTextNode(child)
                        : child
                );
            }
        })(element, child);
    }

    return element;
}