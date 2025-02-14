import '../common/styles.js'

const CHAR_SHEET_NAME = 'Dark MtA 20th Char Sheet'
const CHAR_SHEET_VERSION = 'v0.7';
const CHAR_SHEET_TITLE = `${CHAR_SHEET_NAME} ${CHAR_SHEET_VERSION}`;

document.title = CHAR_SHEET_TITLE;
document.getElementById('page-title').innerHTML = CHAR_SHEET_TITLE;

import { configureTabsAndButtons } from '../common/tabs.js'

import { SVGIcons } from '../common/svg.js'
import { HTMLTags, render } from '../common/render.js'
import { DarkEvent, ValueWrapper } from '../common/utilities.js'
import { UIText, UITextList, } from '../common/uiElements_old.js'
import { CharUiLineDotsSectionsPartElement, CharUiBlockDotsElement, CharUiLineInputDotsWithVariantsListElement, CharUiLineInputPointsWithVariantsListElement, CharUiBlockPointsElement } from '../common/charElements_old.js'

import { CHAR_PARTS, CHAR_VALUES_TRANSLATIONS, CHAR_EDIT_STATES, CHAR_SETTINGS_TRANSLATION, CHAR_VALIDATIONS } from '../setting/MtA20.js'

const CSS = Object.freeze({
    TAB_BUTTON: 'tab-button',
    TAB_CONTENT: 'tab-content',
    TEXT_ALIGN_CENTER: 'text-align-center',
    VERTICAL_ALIGN_TOP: 'vertical-align-top',
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

        this.data = keeper;

        this.parts = {
            [CHAR_PARTS.ATTRIBUTES]: new CharUiLineDotsSectionsPartElement({
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
            [CHAR_PARTS.ABILITIES]: new CharUiLineDotsSectionsPartElement({
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
            [CHAR_PARTS.SPHERES]: new CharUiLineDotsSectionsPartElement({
                data: {
                    keeper,
                    partInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.SPHERES],
                },
                validations: {
                    validations: this.validations,
                    dataForValidations: this.validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.ARETE]: new CharUiBlockDotsElement({
                data: {
                    keeper,
                    valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.ARETE],
                },
                validations: {
                    validations: this.validations,
                    partValidations: this.validations[CHAR_PARTS.ARETE],
                    dataForValidations: this.validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.WILLPOWER]: new CharUiBlockDotsElement({
                data: {
                    keeper,
                    valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.WILLPOWER],
                },
                validations: {
                    validations: this.validations,
                    partValidations: this.validations[CHAR_PARTS.WILLPOWER],
                    dataForValidations: this.validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.EXPERIENCE]: new CharUiBlockPointsElement({
                data: {
                    keeper,
                    valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.EXPERIENCE],
                },
                validations: {
                    validations: this.validations,
                    partValidations: this.validations[CHAR_PARTS.EXPERIENCE],
                    dataForValidations: this.validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.BACKGROUNDS]: new CharUiLineInputDotsWithVariantsListElement({
                data: {
                    keeper,
                    valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.BACKGROUNDS],
                },
                validations: {
                    validations: this.validations,
                    partValidations: this.validations[CHAR_PARTS.BACKGROUNDS],
                    dataForValidations: this.validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.MERITS]: new CharUiLineInputPointsWithVariantsListElement({
                data: {
                    keeper,
                    valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.MERITS],
                },
                validations: {
                    validations: this.validations,
                    partValidations: this.validations[CHAR_PARTS.MERITS],
                    dataForValidations: this.validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.FLAWS]: new CharUiLineInputPointsWithVariantsListElement({
                data: {
                    keeper,
                    valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.FLAWS],
                },
                validations: {
                    validations: this.validations,
                    partValidations: this.validations[CHAR_PARTS.FLAWS],
                    dataForValidations: this.validationsInfo,
                },
                updateEvent: updateEvent,
            }),
        };

        const charElement = render(
            HTMLTags.Table, {},
            render(
                HTMLTags.TableRow, {},
                render(HTMLTags.TableData, {}, this.parts[CHAR_PARTS.ATTRIBUTES].element),
            ),
            render(
                HTMLTags.TableRow, {},
                render(HTMLTags.TableData, {}, this.parts[CHAR_PARTS.ABILITIES].element),
            ),
            render(
                HTMLTags.TableRow, {},
                render(HTMLTags.TableData, {}, this.parts[CHAR_PARTS.SPHERES].element),
            ),
            render(
                HTMLTags.TableRow, {},
                render(
                    HTMLTags.TableData, {},
                    render(
                        HTMLTags.Table, {},
                        render(
                            HTMLTags.TableRow, {},
                            render(HTMLTags.TableData, {}, this.parts[CHAR_PARTS.ARETE].element),
                            render(HTMLTags.TableData, {}, this.parts[CHAR_PARTS.WILLPOWER].element),
                            render(HTMLTags.TableData, {}, this.parts[CHAR_PARTS.EXPERIENCE].element),
                        ),
                    ),
                ),
            ),
            render(
                HTMLTags.TableRow, {},
                render(
                    HTMLTags.TableData, {},
                    render(
                        HTMLTags.Table, {},
                        render(
                            HTMLTags.TableRow, {},
                            render(HTMLTags.TableData, {}, this.parts[CHAR_PARTS.BACKGROUNDS].element),
                            render(HTMLTags.TableData, {}, this.parts[CHAR_PARTS.MERITS].element),
                            render(HTMLTags.TableData, {}, this.parts[CHAR_PARTS.FLAWS].element),
                        ),
                    ),
                ),
            ),
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
                render(HTMLTags.TableData, { class: CSS.VERTICAL_ALIGN_TOP }, errorsElement),
            ),
        );

        this.tabButtonText = new UIText(validations.stateTranslation, {});
        this.tabButton = render(
            HTMLTags.Div,
            { class: CSS.TAB_BUTTON },
            this.tabButtonText.element,
        );

        this.tabContent = render(
            HTMLTags.Div,
            { class: CSS.TAB_CONTENT },
            this.element,
        );
    }

    update() {
        for (const part of Object.values(this.parts)) {
            part.update();
        }

        this.tabButtonText.setText(`${this.validations.stateTranslation} (${this.getPrice()})`);
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

        if (this.validations?.freePointsField) {
            const freePointsCount = this.data[this.validations?.freePointsField];

            if (freePointsCount === undefined || freePointsCount === '' || Number.isNaN(freePointsCount)) {
                errors.push({
                    ...this.validationsInfo,
                    text: `Поле "${CHAR_SETTINGS_TRANSLATION[this.validations?.freePointsField]?.translation}" должно быть заполнено числом`,
                });
            } else {
                const price = this.getPrice();

                if (price > freePointsCount) {
                    errors.push({
                        ...this.validationsInfo,
                        text: `Не может быть распределено больше ${freePointsCount} очков (сейчас ${price})`,
                    });
                }
            }
        }

        // Highlight Border
        if (errors.length > 0) {
            this.tabButton.classList.add(CSS.BORDER_RED_1);
            this.tabContent.classList.add(CSS.BORDER_RED_1);
        } else {
            this.tabButton.classList.remove(CSS.BORDER_RED_1);
            this.tabContent.classList.remove(CSS.BORDER_RED_1);
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
    }

    update() {
        const states = Object.values(this.states);

        for (const state of states) {
            state.update();
        }

        const errors = states.flatMap(state => state.validate() ?? []) ?? [];
        const errorTexts = errors.map(error => [
            error.state, error.part, error.section, error.value, error.commonValue, error.text
        ].filter(x => x).join(': ')) ?? [];

        for (const state of states) {
            state.errorsList.clear();

            for (const error of errorTexts) {
                state.errorsList.addItem(error, { class: CSS.BORDER_RED_1 });
            }
        }
    }
}

class ConfigTab {
    constructor(data) {
        this.data = data;

        this.charTextElement = render(
            HTMLTags.TextArea,
            { cols: 45, rows: 45, readonly: true, disabled: true, },
        );

        this.tabButton = render(
            HTMLTags.Div,
            { class: CSS.TAB_BUTTON },
            CHAR_SETTINGS_TRANSLATION,
        );

        this.tabContent = render(
            HTMLTags.Div,
            { class: CSS.TAB_CONTENT },
            this.charTextElement,
        );

        this.update();
    }

    update() {
        this.charTextElement.value = JSON.stringify(this.data, null, 2);
    }
}

const characterData = { version: CHAR_SHEET_VERSION };
const characterUi = new CharacterMtA(characterData);

const tabs = editStatesForTabsOrder.map(editState => ({
    button: characterUi.states[editState].tabButton,
    content: characterUi.states[editState].tabContent,
}));

const config = new ConfigTab(characterData);
characterUi.updateEvent.addHandler(() => config.update());
tabs.push({
    button: config.tabButton,
    content: config.tabContent,
});

characterUi.updateEvent.invoke();

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