import '../common/styles.js'

const CHAR_SHEET_NAME = 'Dark MtA 20th Char Sheet'
const CHAR_SHEET_VERSION = 'v0.1';
const CHAR_SHEET_TITLE = `${CHAR_SHEET_NAME} ${CHAR_SHEET_VERSION}`;

document.title = CHAR_SHEET_TITLE;
document.getElementById('page-title').innerHTML = CHAR_SHEET_TITLE;

import { configureTabsAndButtons } from '../common/tabs.js'

import { SVGIcons } from '../common/svg.js'
import { HTMLTags, render } from '../common/render.js'
import { UIText, UIPointsLine, UITextInputType, UITextInput, UITextList, } from '../common/uiElements.js'
import { DarkEvent, CharLineValueElement, CharLineValuesSectionElement, CharLineValuesSectionsPartElement } from '../common/charElements.js'

import { CHAR_PARTS, CHAR_VALUES_TRANSLATIONS, CHAR_EDIT_STATES, CHAR_EDIT_STATES_TRANSLATIONS, CHAR_RESULT_TRANSLATIONS, CHAR_SETTINGS_TRANSLATIONS, CHAR_VALIDATIONS } from '../setting/MtA20.js'

const CSS = Object.freeze({
    TEXT_ALIGN_CENTER: 'text-align-center',
    BORDER_BLACK_1: 'border-black-1',
    BORDER_RED_1: 'border-red-1',
});

const editStatesForTabsOrder = [CHAR_EDIT_STATES.BASE, CHAR_EDIT_STATES.POINTS, CHAR_EDIT_STATES.EXP, CHAR_EDIT_STATES.TOTAL];

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

        const charElement = render(
            HTMLTags.Table, {},
            Object.values(this.parts).map(part => render(
                HTMLTags.TableRow, {},
                render(HTMLTags.TableData, {}, part.element),
            )),
        );

        this.errorsList = new UITextList();
        const errorsElement = render(
            HTMLTags.Table, { class: CSS.BORDER_BLACK_1 },
            render(
                HTMLTags.TableRow, {},
                render(HTMLTags.TableData, { class: CSS.TEXT_ALIGN_CENTER }, 'Ошибки'),
            ),
            render(
                HTMLTags.TableRow, {},
                render(HTMLTags.TableData, {}, this.errorsList.element),
            ),
        );

        this.element = render(
            HTMLTags.Table, {},
            render(
                HTMLTags.TableRow, {},
                render(HTMLTags.TableData, {}, charElement),
                render(HTMLTags.TableData, {}, errorsElement),
            ),
        );
    }

    update() {
        for (const part of Object.values(this.parts)) {
            part.update();
        }
    }

    validate() {
        const errors = Object.values(this.parts).flatMap(part => part.validate() ?? []) ?? [];

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

    getPrice() {
        return Object.values(this.parts).reduce((acc, cur) => acc += cur.getPrice(), 0);
    }
}

class CharacterMtA {
    constructor(keeper) {
        const instance = this;

        const updateEvent = this.updateEvent = new DarkEvent();
        updateEvent.addHandler(() => instance.update());

        this.states = {};
        for (const state of editStatesForTabsOrder) {
            this.states[state] = new CharacterMtAState({
                keeper,
                validations: CHAR_VALIDATIONS[state],
                updateEvent,
            });
        }

        updateEvent.invoke();
    }

    update() {
        const errors = this.validate()?.map(error => [
            error.state, error.part, error.section, error.value, error.text
        ].filter(x => x).join(': ')) ?? [];

        for (const state of Object.values(this.states)) {
            state.update();

            state.errorsList.clear();

            for (const error of errors) {
                state.errorsList.addItem(error, { class: CSS.BORDER_RED_1 });
            }
        }
    }

    validate() {
        return Object.values(this.states).flatMap(state => state.validate() ?? []) ?? [];
    }
}

const characterData = {};
const characterUi = new CharacterMtA(characterData);

const tabs = editStatesForTabsOrder.map(editState => {
    return {
        button: render(
            HTMLTags.Div,
            { class: 'tab-button' },
            CHAR_EDIT_STATES_TRANSLATIONS[editState],
        ),
        content: render(
            HTMLTags.Div,
            { class: 'tab-content' },
            characterUi.states[editState].element,
        ),
    };
});

const bottomContainer = render(HTMLTags.Div, {},);
characterUi.updateEvent.addHandler(() => {
    bottomContainer.innerHTML = JSON.stringify(characterData, null, 2);
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