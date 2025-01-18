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

import { CHAR_PARTS, CHAR_VALUES_TRANSLATIONS, CHAR_EDIT_STATES, CHAR_EDIT_STATES_TRANSLATIONS, CHAR_RESULT_TRANSLATIONS, CHAR_SETTINGS_TRANSLATIONS, CHAR_VALIDATIONS } from '../setting/MtA20.js'

const editStatesFrotTabsOrder = [CHAR_EDIT_STATES.BASE, CHAR_EDIT_STATES.POINTS, CHAR_EDIT_STATES.EXP, CHAR_EDIT_STATES.TOTAL];

const character = {};
const charUpdateEvent = new DarkEvent();

class CharacterMtAState {
    constructor(input) {
        const {
            keeper,
            validations,
            updateEvent,
        } = input;

        this.updateEvent = updateEvent;

        this.validations = validations;
        this.validationsInfo = { state: validations.stateTranslation };

        this.parts = {
            [CHAR_PARTS.ATTRIBUTES]: new CharLineValuesSectionsPartElement({
                data: {
                    keeper,
                    partInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.ATTRIBUTES],
                },
                validations: {
                    validations: this.validations,
                    dataForValidations: this.validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.ABILITIES]: new CharLineValuesSectionsPartElement({
                data: {
                    keeper,
                    partInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.ABILITIES],
                },
                validations: {
                    validations: this.validations,
                    dataForValidations: this.validationsInfo,
                },
                updateEvent: updateEvent,
            }),
        };
    }

    update() {
        for (const part of this.parts) {
            part.update();
        }
    }

    validate() {
        const errors = Object.values(this.parts).flatMap(part => part.validate() ?? []);

        if (this.validations?.freePoints) {
            const price = this.getPrice();

            if (price !== this.validations.freePoints) {
                errors.push({
                    ...this.validationsInfo,
                    text: `Должно быть распределено ${this.validations.freePoints} точек (сейчас ${price})`,
                });
            }
        }

        return errors;
    }
}

class CharacterMtA {
    constructor() {
        //
    }
}

const tabs = editStatesFrotTabsOrder.map(editState => {
    const data = new CharLineValuesSectionsPartElement({
        data: {
            keeper: character,
            partInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.ABILITIES],
        },
        validations: {
            validations: CHAR_VALIDATIONS[editState],
            dataForValidations: { state: editState, },
        },
        updateEvent: charUpdateEvent,
    });

    charUpdateEvent.addHandler(() => data.update());

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

const bottomContainer = render(HTMLTags.Div, {},);
charUpdateEvent.addHandler(() => {
    bottomContainer.innerHTML = JSON.stringify(character, null, 2);
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