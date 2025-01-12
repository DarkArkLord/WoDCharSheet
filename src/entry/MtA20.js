import '../common/styles.js'

const CHAR_SHEET_NAME = 'Dark MtA 20th Char Sheet'
const CHAR_SHEET_VERSION = 'v0.1';
const CHAR_SHEET_TITLE = `${CHAR_SHEET_NAME} ${CHAR_SHEET_VERSION}`;

document.title = CHAR_SHEET_TITLE;
document.getElementById('page-title').innerHTML = CHAR_SHEET_TITLE;

import { SVGIcons } from '../common/svg.js'

import { HTMLTags, render } from '../common/render.js'
import { configureTabsAndButtons } from '../common/tabs.js'

import { UIPointsLine } from '../common/elements.js'

const testContentForTabs = {
    [1]: {
        title: 'Точки',
        content: [
            SVGIcons.POINT_DISABLED,
            SVGIcons.POINT_DISABLED,
            SVGIcons.POINT_ACTIVE,
            SVGIcons.POINT_ACTIVE,
            SVGIcons.POINT_EMPTY,
            SVGIcons.POINT_EMPTY,
        ],
    },
    [2]: {
        title: 'Кнопки',
        content: [
            SVGIcons.BUTTON_ADD_ENABLED,
            SVGIcons.BUTTON_ADD_DISABLED,
            SVGIcons.BUTTON_SUB_ENABLED,
            SVGIcons.BUTTON_SUB_DISABLED,
        ],
    },
    [3]: {
        title: 'Квадратики',
        content: [
            SVGIcons.RECT,
            SVGIcons.RECT,
            SVGIcons.RECT,
        ],
    },
}

const tabs = Object.keys(testContentForTabs).map(key => ({
    button: render(
        HTMLTags.Div,
        { class: 'tab-button' },
        testContentForTabs[key].title,
    ),
    content: render(
        HTMLTags.Div,
        { class: 'tab-content' },
        testContentForTabs[key].content.map(src => render(HTMLTags.Img, { src })),
    ),
}));

const pointsLine = new UIPointsLine(5);
pointsLine.addButton.setOnClickEvent(() => {
    pointsLine.addButton.setVisible(!pointsLine.addButton.isVisible);
});
pointsLine.subButton.setOnClickEvent(() => {
    pointsLine.addButton.setVisible(!pointsLine.addButton.isVisible);
});

tabs.unshift({
    button: render(HTMLTags.Div, { class: 'tab-button' }, 'Test',),
    content: render(
        HTMLTags.Div,
        { class: 'tab-content' },
        render(
            HTMLTags.Div,
            { class: 'table' },
            render(
                HTMLTags.Div,
                { class: 'tr' },
                render(
                    HTMLTags.Div,
                    { class: 'td' },
                    'Тут лежат картинки абобусы',
                ),
                render(
                    HTMLTags.Div,
                    { class: 'td' },
                    pointsLine.element,
                ),
            ),
            render(
                HTMLTags.Div,
                { class: 'tr' },
                render(
                    HTMLTags.Div,
                    { class: 'td' },
                    'Тут лежат картинки',
                ),
                render(
                    HTMLTags.Div,
                    { class: 'td' },
                    (new UIPointsLine(7)).element,
                ),
            ),
        ),
    ),
});

document.body.append(
    render(
        HTMLTags.Div,
        { class: 'tab-buttons-container' },
        tabs.map(x => x.button),
    ),
    render(
        HTMLTags.Div,
        {},
        tabs.map(x => x.content),
    ),
);

configureTabsAndButtons({
    tabs: tabs,
    activeTabIndex: 0,
    activeStyleClass: 'active',
});