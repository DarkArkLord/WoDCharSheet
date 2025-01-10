// --- --- База --- ---
const SVGTags = {
    SVG: 'svg',
    Group: 'g',
    Circle: 'circle',
    Line: 'line',
    Rect: 'rect',
}

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

function renderSVG(tag, attributes, ...childs) {
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

// --- --- Константы --- ---
const SVG_ITEM_SIZE = 16;
const SVG_ITEM_SIZE_HALF = SVG_ITEM_SIZE / 2;
const SVG_ITEM_SIZE_QUARTER = SVG_ITEM_SIZE / 4;

const SVG_STROKE_WIDTH = 2;
const SVG_STROKE_WIDTH_HALF = SVG_STROKE_WIDTH / 2;

const SVG_COLOR_NONE = 'none';
const SVG_COLOR_BLACK = '#000';
const SVG_COLOR_GRAY = '#888';
const SVG_COLOR_GREEN = '#0F0';
const SVG_COLOR_RED = '#F00';

// --- --- Функции иконок --- ---
function renderPoint(strikeColor, fillColor) {
    return renderSVG(
        SVGTags.SVG,
        {
            height: SVG_ITEM_SIZE,
            width: SVG_ITEM_SIZE,
            xmlns: SVG_NAMESPACE,
        },
        renderSVG(
            SVGTags.Circle,
            {
                cx: SVG_ITEM_SIZE_HALF,
                cy: SVG_ITEM_SIZE_HALF,
                r: SVG_ITEM_SIZE_HALF - SVG_STROKE_WIDTH_HALF,
                ['stroke-width']: SVG_STROKE_WIDTH,
                stroke: strikeColor,
                fill: fillColor,
            },
        ),
    );
}

function renderAddButton(fillColor) {
    return renderSVG(
        SVGTags.SVG,
        {
            height: SVG_ITEM_SIZE,
            width: SVG_ITEM_SIZE,
            xmlns: SVG_NAMESPACE,
        },
        renderSVG(
            SVGTags.Circle,
            {
                cx: SVG_ITEM_SIZE_HALF,
                cy: SVG_ITEM_SIZE_HALF,
                r: SVG_ITEM_SIZE_HALF,
                fill: fillColor,
            },
        ),
        renderSVG(
            SVGTags.Line,
            {
                x1: SVG_ITEM_SIZE_QUARTER,
                y1: SVG_ITEM_SIZE_HALF,
                x2: SVG_ITEM_SIZE - SVG_ITEM_SIZE_QUARTER,
                y2: SVG_ITEM_SIZE_HALF,
                ['stroke-width']: SVG_STROKE_WIDTH,
                stroke: SVG_COLOR_BLACK,
            },
        ),
        renderSVG(
            SVGTags.Line,
            {
                x1: SVG_ITEM_SIZE_HALF,
                y1: SVG_ITEM_SIZE_QUARTER,
                x2: SVG_ITEM_SIZE_HALF,
                y2: SVG_ITEM_SIZE - SVG_ITEM_SIZE_QUARTER,
                ['stroke-width']: SVG_STROKE_WIDTH,
                stroke: SVG_COLOR_BLACK,
            },
        ),
    );
}

function renderSubButton(fillColor) {
    return renderSVG(
        SVGTags.SVG,
        {
            height: SVG_ITEM_SIZE,
            width: SVG_ITEM_SIZE,
            xmlns: SVG_NAMESPACE,
        },
        renderSVG(
            SVGTags.Circle,
            {
                cx: SVG_ITEM_SIZE_HALF,
                cy: SVG_ITEM_SIZE_HALF,
                r: SVG_ITEM_SIZE_HALF,
                fill: fillColor,
            },
        ),
        renderSVG(
            SVGTags.Line,
            {
                x1: SVG_ITEM_SIZE_QUARTER,
                y1: SVG_ITEM_SIZE_HALF,
                x2: SVG_ITEM_SIZE - SVG_ITEM_SIZE_QUARTER,
                y2: SVG_ITEM_SIZE_HALF,
                ['stroke-width']: SVG_STROKE_WIDTH,
                stroke: SVG_COLOR_BLACK,
            },
        ),
    );
}

// --- --- Иконки --- ---
const SVG_POINT_EMPTY = Object.freeze(renderPoint(SVG_COLOR_BLACK, SVG_COLOR_NONE));
const SVG_POINT_ACTIVE = Object.freeze(renderPoint(SVG_COLOR_BLACK, SVG_COLOR_BLACK));
const SVG_POINT_DISABLED = Object.freeze(renderPoint(SVG_COLOR_GRAY, SVG_COLOR_GRAY));

const SVG_BUTTON_ADD_ENABLED = Object.freeze(renderAddButton(SVG_COLOR_GREEN));
const SVG_BUTTON_ADD_DISABLED = Object.freeze(renderAddButton(SVG_COLOR_GRAY));

const SVG_BUTTON_SUB_ENABLED = Object.freeze(renderSubButton(SVG_COLOR_RED));
const SVG_BUTTON_SUB_DISABLED = Object.freeze(renderSubButton(SVG_COLOR_GRAY));

const SVG_RECT = Object.freeze(renderSVG(
    SVGTags.SVG,
    {
        height: SVG_ITEM_SIZE,
        width: SVG_ITEM_SIZE,
        xmlns: SVG_NAMESPACE,
    },
    renderSVG(
        SVGTags.Rect,
        {
            x: SVG_STROKE_WIDTH,
            y: SVG_STROKE_WIDTH,
            width: SVG_ITEM_SIZE - SVG_STROKE_WIDTH * 2,
            height: SVG_ITEM_SIZE - SVG_STROKE_WIDTH * 2,
            ['stroke-width']: SVG_STROKE_WIDTH,
            stroke: SVG_COLOR_BLACK,
            fill: SVG_COLOR_NONE,
        },
    ),
));

function SVGtoData(svg) {
    // return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg.outerHTML)))}`;
    return `data:image/svg+xml;base64,${window.btoa(svg.outerHTML)}`;
}

export const SVGIcons = Object.freeze({
    POINT_EMPTY: SVGtoData(SVG_POINT_EMPTY),
    POINT_ACTIVE: SVGtoData(SVG_POINT_ACTIVE),
    POINT_DISABLED: SVGtoData(SVG_POINT_DISABLED),
    BUTTON_ADD_ENABLED: SVGtoData(SVG_BUTTON_ADD_ENABLED),
    BUTTON_ADD_DISABLED: SVGtoData(SVG_BUTTON_ADD_DISABLED),
    BUTTON_SUB_ENABLED: SVGtoData(SVG_BUTTON_SUB_ENABLED),
    BUTTON_SUB_DISABLED: SVGtoData(SVG_BUTTON_SUB_DISABLED),
    RECT: SVGtoData(SVG_RECT),
});