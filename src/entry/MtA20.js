import '../common/styles.js'

const CHAR_SHEET_NAME = 'Dark MtA 20th Char Sheet'
const CHAR_SHEET_VERSION = 'v0.1';
const CHAR_SHEET_TITLE = `${CHAR_SHEET_NAME} ${CHAR_SHEET_VERSION}`;

document.title = CHAR_SHEET_TITLE;
document.getElementById('page-title').innerHTML = CHAR_SHEET_TITLE;

import { configureTabsAndButtons } from '../common/tabs.js'

import { SVGIcons } from '../common/svg.js'
import { HTMLTags, render } from '../common/render.js'
import { UIText, UIPointsLine, UITextInputType, UITextInput } from '../common/uiElements.js'
import { DarkEvent, CharLineValueElement } from '../common/charElements.js'

import { CHAR_PARTS, CHAR_VALUES_TRANSLATIONS, CHAR_EDIT_STATES, CHAR_EDIT_STATES_TRANSLATIONS, CHAR_RESULT_TRANSLATIONS, CHAR_SETTINGS_TRANSLATIONS, CHAR_VALIDATIONS, CHAR_VALIDATIONS_TOTAL } from '../setting/MtA20.js'

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

const character = {};
const sectionField = CHAR_PARTS.ABILITIES;
const charValue = CHAR_VALUES_TRANSLATIONS[sectionField].sections[0].values[0];

const event = new DarkEvent();

const e1 = new CharLineValueElement({
    keeper: character,
    valueInfo: charValue,
    validations: CHAR_VALIDATIONS[CHAR_EDIT_STATES.BASE],
    validationsField: sectionField,
    updateEvent: event,
});
event.addHandler(() => e1.update());

const e2 = new CharLineValueElement({
    keeper: character,
    valueInfo: charValue,
    validations: CHAR_VALIDATIONS[CHAR_EDIT_STATES.POINTS],
    validationsField: sectionField,
    updateEvent: event,
});
event.addHandler(() => e2.update());

const e3 = new CharLineValueElement({
    keeper: character,
    valueInfo: charValue,
    validations: CHAR_VALIDATIONS[CHAR_EDIT_STATES.EXP],
    validationsField: sectionField,
    updateEvent: event,
});
event.addHandler(() => e3.update());

const e4 = new CharLineValueElement({
    keeper: character,
    valueInfo: charValue,
    validations: CHAR_VALIDATIONS[CHAR_EDIT_STATES.TOTAL],
    validationsField: sectionField,
    updateEvent: event,
    pointsCount: 10,
});
event.addHandler(() => e4.update());

tabs.unshift({
    button: render(HTMLTags.Div, { class: 'tab-button' }, 'Test',),
    content: render(
        HTMLTags.Div,
        { class: 'tab-content' },
        e1.element,
        e2.element,
        e3.element,
        e4.element,
    ),
});

const bottomContainer = render(HTMLTags.Div, {},);
event.addHandler(() => {
    const summary = {};

    for (const e of [e1, e2, e3, e4]) {
        summary[e.validations.valueTranslation] = e.priceWrapper.getPrice();
    }

    bottomContainer.innerHTML = JSON.stringify(summary);
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
    bottomContainer,
);

configureTabsAndButtons({
    tabs: tabs,
    activeTabIndex: 0,
    activeStyleClass: 'active',
});