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
import { DarkEvent, CharLineValueElement, CharLineValuesSectionElement, CharLineValuesSectionsPartElement } from '../common/charElements.js'

import { CHAR_PARTS, CHAR_VALUES_TRANSLATIONS, CHAR_EDIT_STATES, CHAR_EDIT_STATES_TRANSLATIONS, CHAR_RESULT_TRANSLATIONS, CHAR_SETTINGS_TRANSLATIONS, CHAR_VALIDATIONS, CHAR_VALIDATIONS_TOTAL } from '../setting/MtA20.js'

const editStatesFrotTabsOrder = [CHAR_EDIT_STATES.BASE, CHAR_EDIT_STATES.POINTS, CHAR_EDIT_STATES.EXP, CHAR_EDIT_STATES.TOTAL];

const character = {};

const event = new DarkEvent();

const tabs = editStatesFrotTabsOrder.map(editState => {
    const data = new CharLineValuesSectionsPartElement({
        keeper: character,
        partInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.ABILITIES],
        validations: CHAR_VALIDATIONS[editState],
        updateEvent: event,
    });

    event.addHandler(() => data.update());

    return {
        button: render(
            HTMLTags.Div,
            { class: 'tab-button' },
            CHAR_EDIT_STATES_TRANSLATIONS[editState],
        ),
        content: render(
            HTMLTags.Div,
            { class: 'tab-content' },
            data.element,
        ),
    };
});

// const bottomContainer = render(HTMLTags.Div, {},);
// event.addHandler(() => {
//     const summary = {};

//     for (const e of [e1, e2, e3, e4]) {
//         summary[e.validations.valueTranslation] = e.priceWrapper.getPrice();
//     }

//     bottomContainer.innerHTML = JSON.stringify(summary);
// });

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
    // bottomContainer,
);

configureTabsAndButtons({
    tabs: tabs,
    activeTabIndex: 0,
    activeStyleClass: 'active',
});