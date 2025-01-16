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
import { DarkEvent, CharValueElement } from '../common/charElements.js'

import { CHAR_SECTIONS, CHAR_VALUES_TRANSLATIONS, CHAR_EDIT_STATES, CHAR_EDIT_STATES_TRANSLATIONS, CHAR_RESULT_TRANSLATIONS, CHAR_SETTINGS_TRANSLATIONS, CHAR_VALIDATIONS, CHAR_VALIDATIONS_TOTAL } from '../setting/MtA20.js'

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

// const pointsLine = new UIPointsLine(5, true, { class: 'td left-padding-5px' });
// pointsLine.addButton.setOnClickEvent(() => {
//     pointsLine.addButton.setVisible(!pointsLine.addButton.isVisible);
// });
// pointsLine.subButton.setOnClickEvent(() => {
//     pointsLine.addButton.setVisible(!pointsLine.addButton.isVisible);
// });
// pointsLine.setValue(2, 2);

// tabs.unshift({
//     button: render(HTMLTags.Div, { class: 'tab-button' }, 'Test',),
//     content: render(
//         HTMLTags.Div,
//         { class: 'tab-content' },
//         render(
//             HTMLTags.Div,
//             { class: 'table' },
//             render(
//                 HTMLTags.Div,
//                 { class: 'tr' },
//                 (new UIText('Тут лежат картинки абобусы', { class: 'td' })).element,
//                 (new UITextInput({ class: 'td left-padding-5px' }, UITextInputType.Number, 0, 6)).element,
//                 (new UIText('арзубузс', { class: 'td left-padding-5px' })).element,
//                 pointsLine.element,
//             ),
//             render(
//                 HTMLTags.Div,
//                 { class: 'tr' },
//                 (new UIText('Тут лежат картинки', { class: 'td' })).element,
//                 (new UIText('арзубузс', { class: 'td left-padding-5px' })).element,
//                 (new UITextInput({ class: 'td left-padding-5px' }, UITextInputType.Text)).element,
//                 (new UIPointsLine(7, false, { class: 'td left-padding-5px' })).element,
//             ),
//         ),
//     ),
// });

const character = {};
const section = CHAR_SECTIONS.ABILITIES;
const charValue = CHAR_VALUES_TRANSLATIONS[section].sections[0].values[0];

const event = new DarkEvent();

const e1 = new CharValueElement({
    keeper: character,
    valueInfo: charValue,
    valudations: CHAR_VALIDATIONS[CHAR_EDIT_STATES.BASE],
    validationsField: section,
    updateEvent: event,
});
event.addHandler(() => e1.update());

const e2 = new CharValueElement({
    keeper: character,
    valueInfo: charValue,
    valudations: CHAR_VALIDATIONS[CHAR_EDIT_STATES.POINTS],
    validationsField: section,
    updateEvent: event,
});
event.addHandler(() => e2.update());

const e3 = new CharValueElement({
    keeper: character,
    valueInfo: charValue,
    valudations: CHAR_VALIDATIONS[CHAR_EDIT_STATES.EXP],
    validationsField: section,
    updateEvent: event,
});
event.addHandler(() => e3.update());

const e4 = new CharValueElement({
    keeper: character,
    valueInfo: charValue,
    valudations: CHAR_VALIDATIONS[CHAR_EDIT_STATES.TOTAL],
    validationsField: section,
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