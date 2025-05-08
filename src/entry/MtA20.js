import '../common/styles.js'

const CHAR_SHEET_NAME = 'Dark MtA 20th Char Sheet'
const CHAR_SHEET_VERSION = 'v0.9';
const CHAR_SHEET_TITLE = `${CHAR_SHEET_NAME} ${CHAR_SHEET_VERSION}`;

document.title = CHAR_SHEET_TITLE;
document.getElementById('page-title').innerHTML = CHAR_SHEET_TITLE;

import { configureDarkTabsAndButtons } from '../common/tabs.js'

import { DElementBuilder, ATTRIBUTES, EVENTS, ACTIONS, DTableBuilder, DTableRowBuilder } from '../common/domWrapper.js'
import { DarkEvent, } from '../common/utilities.js'
import { UIText, UITextList, } from '../common/uiElements.js'
import { CharUiLineDotsSectionsPartElement, CharUiBlockDotsElement, CharUiLineInputDotsWithVariantsListElement, CharUiLineInputPointsWithVariantsListElement, CharUiBlockPointsElement } from '../common/charElements.js'

import { CharacterBaseState, CharSheetEntryPoint } from '../common/entryPoint.js'
import { CHAR_PARTS, CHAR_VALUES_TRANSLATIONS, CHAR_EDIT_STATES, CHAR_SETTINGS_TRANSLATION, CHAR_VALIDATIONS } from '../setting/MtA20.js'

const CSS = Object.freeze({
    TAB_BUTTON: 'tab-button',
    TAB_CONTENT: 'tab-content',
    TEXT_ALIGN_CENTER: 'text-align-center',
    VERTICAL_ALIGN_TOP: 'vertical-align-top',
    BORDER_BLACK_1: 'border-black-1',
    BORDER_RED_1: 'border-red-1',
    TAB_BUTTONS_CONTAINER: 'tab-buttons-container',
});

const editStatesForTabsOrder = [CHAR_EDIT_STATES.BASE, CHAR_EDIT_STATES.POINTS, CHAR_EDIT_STATES.EXP, CHAR_EDIT_STATES.TOTAL];

// class CharacterMtAState {
//     constructor(input) {
//         const {
//             keeper,
//             validations,
//             updateEvent,
//         } = input;

//         const validationsInfo = { state: validations.stateTranslation };
//         const parts = CharacterMtAState.createPartsElements({ keeper, validations, updateEvent, validationsInfo });
//         const characterUi = CharacterMtAState.createCharacterUi(parts);

//         const errorsList = new UITextList();
//         const errorsElement = CharacterMtAState.createErrorsElement(errorsList);

//         const tabContent = CharacterMtAState.createTabContent(characterUi, errorsElement);

//         const tabContainer = DElementBuilder.initDiv()
//             .setAttribute(ATTRIBUTES.CLASS, CSS.TAB_CONTENT)
//             .appendChilds(tabContent)
//             .create();

//         const tabButtonText = new UIText(validations.stateTranslation, {});
//         const tabButtonContainer = DElementBuilder.initDiv()
//             .setAttribute(ATTRIBUTES.CLASS, CSS.TAB_BUTTON)
//             .appendChilds(tabButtonText.getElement())
//             .create();

//         this.inner = {
//             updateEvent,
//             data: keeper,
//             validations: {
//                 info: validationsInfo,
//                 main: validations,
//             },
//             elements: {
//                 parts,
//                 characterUi,
//                 errorsList,
//                 errorsElement,
//                 tabContent,
//                 tabContainer,
//                 tabButtonText,
//                 tabButtonContainer,
//             },
//         };
//     }

//     static createPartsElements(input) {
//         const { keeper, validations, updateEvent, validationsInfo } = input;
//         return {
//             [CHAR_PARTS.ATTRIBUTES]: new CharUiLineDotsSectionsPartElement({
//                 data: {
//                     keeper,
//                     partInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.ATTRIBUTES],
//                 },
//                 validations: {
//                     validations: validations,
//                     dataForValidations: validationsInfo,
//                 },
//                 updateEvent: updateEvent,
//             }),
//             [CHAR_PARTS.ABILITIES]: new CharUiLineDotsSectionsPartElement({
//                 data: {
//                     keeper,
//                     partInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.ABILITIES],
//                 },
//                 validations: {
//                     validations: validations,
//                     dataForValidations: validationsInfo,
//                 },
//                 updateEvent: updateEvent,
//             }),
//             [CHAR_PARTS.SPHERES]: new CharUiLineDotsSectionsPartElement({
//                 data: {
//                     keeper,
//                     partInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.SPHERES],
//                 },
//                 validations: {
//                     validations: validations,
//                     dataForValidations: validationsInfo,
//                 },
//                 updateEvent: updateEvent,
//             }),
//             [CHAR_PARTS.ARETE]: new CharUiBlockDotsElement({
//                 data: {
//                     keeper,
//                     valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.ARETE],
//                 },
//                 validations: {
//                     validations: validations,
//                     partValidations: validations[CHAR_PARTS.ARETE],
//                     dataForValidations: validationsInfo,
//                 },
//                 updateEvent: updateEvent,
//             }),
//             [CHAR_PARTS.WILLPOWER]: new CharUiBlockDotsElement({
//                 data: {
//                     keeper,
//                     valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.WILLPOWER],
//                 },
//                 validations: {
//                     validations: validations,
//                     partValidations: validations[CHAR_PARTS.WILLPOWER],
//                     dataForValidations: validationsInfo,
//                 },
//                 updateEvent: updateEvent,
//             }),
//             [CHAR_PARTS.EXPERIENCE]: new CharUiBlockPointsElement({
//                 data: {
//                     keeper,
//                     valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.EXPERIENCE],
//                 },
//                 validations: {
//                     validations: validations,
//                     partValidations: validations[CHAR_PARTS.EXPERIENCE],
//                     dataForValidations: validationsInfo,
//                 },
//                 updateEvent: updateEvent,
//             }),
//             [CHAR_PARTS.BACKGROUNDS]: new CharUiLineInputDotsWithVariantsListElement({
//                 data: {
//                     keeper,
//                     valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.BACKGROUNDS],
//                     showHeader: true,
//                 },
//                 validations: {
//                     validations: validations,
//                     partValidations: validations[CHAR_PARTS.BACKGROUNDS],
//                     dataForValidations: validationsInfo,
//                 },
//                 updateEvent: updateEvent,
//             }),
//             [CHAR_PARTS.MERITS]: new CharUiLineInputPointsWithVariantsListElement({
//                 data: {
//                     keeper,
//                     valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.MERITS],
//                 },
//                 validations: {
//                     validations: validations,
//                     partValidations: validations[CHAR_PARTS.MERITS],
//                     dataForValidations: validationsInfo,
//                 },
//                 updateEvent: updateEvent,
//             }),
//             [CHAR_PARTS.FLAWS]: new CharUiLineInputPointsWithVariantsListElement({
//                 data: {
//                     keeper,
//                     valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.FLAWS],
//                 },
//                 validations: {
//                     validations: validations,
//                     partValidations: validations[CHAR_PARTS.FLAWS],
//                     dataForValidations: validationsInfo,
//                 },
//                 updateEvent: updateEvent,
//             }),
//         };
//     }

//     static createCharacterUi(parts) {
//         const resultBuilder = DTableBuilder.init();

//         resultBuilder.addRow().addData()
//             .appendChilds(parts[CHAR_PARTS.ATTRIBUTES].getElement());
//         resultBuilder.addRow().addData()
//             .appendChilds(parts[CHAR_PARTS.ABILITIES].getElement());
//         resultBuilder.addRow().addData()
//             .appendChilds(parts[CHAR_PARTS.SPHERES].getElement());

//         const aweBuilder = DTableBuilder.init();
//         const aweRowBuilder = aweBuilder.addRow();
//         aweRowBuilder.addData().appendChilds(parts[CHAR_PARTS.ARETE].getElement());
//         aweRowBuilder.addData().appendChilds(parts[CHAR_PARTS.WILLPOWER].getElement());
//         aweRowBuilder.addData().appendChilds(parts[CHAR_PARTS.EXPERIENCE].getElement());

//         resultBuilder.addRow().addData()
//             .appendChilds(aweBuilder.create());

//         const bmlBuilder = DTableBuilder.init();
//         const bmlRowBuilder = bmlBuilder.addRow();
//         bmlRowBuilder.addData().appendChilds(parts[CHAR_PARTS.BACKGROUNDS].getElement());
//         bmlRowBuilder.addData().appendChilds(parts[CHAR_PARTS.MERITS].getElement());
//         bmlRowBuilder.addData().appendChilds(parts[CHAR_PARTS.FLAWS].getElement());

//         resultBuilder.addRow().addData()
//             .appendChilds(bmlBuilder.create());

//         return resultBuilder.create();
//     }

//     static createErrorsElement(errorsList) {
//         const errorsElementBuilder = DTableBuilder.init();
//         errorsElementBuilder.getBuilder()
//             .setAttribute(ATTRIBUTES.CLASS, CSS.BORDER_BLACK_1);

//         errorsElementBuilder.addRow().addData()
//             .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
//             .appendChilds('Ошибки');
//         errorsElementBuilder.addRow().addData()
//             .appendChilds(errorsList.getElement());

//         return errorsElementBuilder.create();
//     }

//     static createTabContent(characterUi, errorsElement) {
//         const tabContentBuilder = DTableBuilder.init();
//         const tabContentRowBuilder = tabContentBuilder.addRow();
//         tabContentRowBuilder.addData()
//             .appendChilds(characterUi);
//         tabContentRowBuilder.addData()
//             .setAttribute(ATTRIBUTES.CLASS, CSS.VERTICAL_ALIGN_TOP)
//             .appendChilds(errorsElement);

//         return tabContentBuilder.create();
//     }

//     getErrorsList() {
//         return this.inner.elements.errorsList;
//     }

//     getTabButton() {
//         return this.inner.elements.tabButtonContainer;
//     }

//     getTabContent() {
//         return this.inner.elements.tabContainer;
//     }

//     update() {
//         const elements = this.inner.elements;
//         for (const part of Object.values(elements.parts)) {
//             part.update();
//         }

//         elements.tabButtonText.setText(`${this.inner.validations.main.stateTranslation} (${this.getPrice()})`);
//     }

//     validate() {
//         const elements = this.inner.elements;
//         const validations = this.inner.validations.main;
//         const errors = Object.values(elements.parts).flatMap(part => part.validate() ?? []) ?? [];

//         if (validations?.freePoints) {
//             const price = this.getPrice();

//             if (price !== validations.freePoints) {
//                 errors.push({
//                     ...this.inner.validations.info,
//                     text: `Должно быть распределено ${validations.freePoints} точек (сейчас ${price})`,
//                 });
//             }
//         }

//         if (validations?.freePointsField) {
//             const freePointsCount = this.inner.data[validations.freePointsField];

//             if (freePointsCount === undefined || freePointsCount === '' || Number.isNaN(freePointsCount)) {
//                 errors.push({
//                     ...this.inner.validations.info,
//                     text: `Поле "${CHAR_SETTINGS_TRANSLATION[validations.freePointsField]?.translation}" должно быть заполнено числом`,
//                 });
//             } else {
//                 const price = this.getPrice();
//                 if (price > freePointsCount) {
//                     errors.push({
//                         ...this.inner.validations.info,
//                         text: `Не может быть распределено больше ${freePointsCount} очков (сейчас ${price})`,
//                     });
//                 }
//             }
//         }

//         // Highlight Border
//         if (errors.length > 0) {
//             elements.tabButtonContainer.addClass(CSS.BORDER_RED_1);
//             elements.tabContainer.addClass(CSS.BORDER_RED_1);
//         } else {
//             elements.tabButtonContainer.removeClass(CSS.BORDER_RED_1);
//             elements.tabContainer.removeClass(CSS.BORDER_RED_1);
//         }

//         return errors;
//     }

//     getPrice() {
//         return Object.values(this.inner.elements.parts).reduce((acc, cur) => acc += cur.getPrice(), 0);
//     }
// }

// class CharacterMtA {
//     constructor(keeper, updateEvent) {
//         const instance = this;
//         updateEvent.addHandler(() => instance.update());

//         const states = {};
//         for (const state of editStatesForTabsOrder) {
//             states[state] = new CharacterMtAState({
//                 keeper,
//                 validations: CHAR_VALIDATIONS[state],
//                 updateEvent,
//             });
//         }

//         this.inner = {
//             data: keeper,
//             updateEvent,
//             states,
//         };
//     }

//     getTabsInfo() {
//         const states = this.inner.states;
//         return editStatesForTabsOrder.map(editState => ({
//             button: states[editState].getTabButton(),
//             content: states[editState].getTabContent(),
//         }));
//     }

//     update() {
//         const states = Object.values(this.inner.states);

//         for (const state of states) {
//             state.update();
//         }

//         const errors = states.flatMap(state => state.validate() ?? []) ?? [];
//         const errorTexts = errors.map(error => [
//             error.state, error.part, error.section, error.value, error.commonValue, error.text
//         ].filter(x => x).join(': ')) ?? [];

//         for (const state of states) {
//             const errorsList = state.getErrorsList();
//             errorsList.clear();

//             for (const error of errorTexts) {
//                 errorsList.addItem(error, { class: CSS.BORDER_RED_1 });
//             }
//         }
//     }
// }

// class ConfigTab {
//     constructor(data, updateEvent) {
//         const instance = this;
//         updateEvent.addHandler(() => instance.update());

//         const charTextElement = DElementBuilder.initTextArea()
//             .setAttribute(ATTRIBUTES.COLS, 45)
//             .setAttribute(ATTRIBUTES.ROWS, 45)
//             .setAttribute(ATTRIBUTES.READ_ONLY, true)
//             .setAttribute(ATTRIBUTES.DISABLED, true)
//             .create();

//         const tabContent = DElementBuilder.initDiv()
//             .setAttribute(ATTRIBUTES.CLASS, CSS.TAB_CONTENT)
//             .appendChilds(charTextElement)
//             .create();

//         const tabButton = DElementBuilder.initDiv()
//             .setAttribute(ATTRIBUTES.CLASS, CSS.TAB_BUTTON)
//             .appendChilds(CHAR_SETTINGS_TRANSLATION)
//             .create();

//         this.inner = {
//             data,
//             updateEvent,
//             elements: {
//                 charTextElement,
//                 tabButton,
//                 tabContent,
//             },
//         };
//     }

//     getTabButton() {
//         return this.inner.elements.tabButton;
//     }

//     getTabContent() {
//         return this.inner.elements.tabContent;
//     }

//     update() {
//         const text = JSON.stringify(this.inner.data, null, 2);
//         this.inner.elements.charTextElement.setValue(text);
//     }
// }

// const updateEvent = new DarkEvent();

// const characterData = { version: CHAR_SHEET_VERSION };
// const characterUi = new CharacterMtA(characterData, updateEvent);

// const tabs = characterUi.getTabsInfo();

// const config = new ConfigTab(characterData, updateEvent);
// tabs.push({
//     button: config.getTabButton(),
//     content: config.getTabContent(),
// });

// updateEvent.invoke();

// document.body.append(
//     DElementBuilder.initDiv()
//         .setAttribute(ATTRIBUTES.CLASS, CSS.TAB_BUTTONS_CONTAINER)
//         .appendChilds(tabs.map(x => x.button))
//         .create().getElement(),
//     DElementBuilder.initDiv()
//         .appendChilds(tabs.map(x => x.content))
//         .create().getElement(),
// );

// configureDarkTabsAndButtons({
//     tabs: tabs,
//     activeTabIndex: 0,
//     activeStyleClass: 'active',
// });

class CharacterMtAState extends CharacterBaseState {
    constructor(input) { super(input); }

    createPartsElements(input) {
        const { keeper, validations, updateEvent, validationsInfo } = input;
        return {
            [CHAR_PARTS.ATTRIBUTES]: new CharUiLineDotsSectionsPartElement({
                data: {
                    keeper,
                    partInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.ATTRIBUTES],
                },
                validations: {
                    validations: validations,
                    dataForValidations: validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.ABILITIES]: new CharUiLineDotsSectionsPartElement({
                data: {
                    keeper,
                    partInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.ABILITIES],
                },
                validations: {
                    validations: validations,
                    dataForValidations: validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.SPHERES]: new CharUiLineDotsSectionsPartElement({
                data: {
                    keeper,
                    partInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.SPHERES],
                },
                validations: {
                    validations: validations,
                    dataForValidations: validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.ARETE]: new CharUiBlockDotsElement({
                data: {
                    keeper,
                    valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.ARETE],
                },
                validations: {
                    validations: validations,
                    partValidations: validations[CHAR_PARTS.ARETE],
                    dataForValidations: validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.WILLPOWER]: new CharUiBlockDotsElement({
                data: {
                    keeper,
                    valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.WILLPOWER],
                },
                validations: {
                    validations: validations,
                    partValidations: validations[CHAR_PARTS.WILLPOWER],
                    dataForValidations: validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.EXPERIENCE]: new CharUiBlockPointsElement({
                data: {
                    keeper,
                    valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.EXPERIENCE],
                },
                validations: {
                    validations: validations,
                    partValidations: validations[CHAR_PARTS.EXPERIENCE],
                    dataForValidations: validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.BACKGROUNDS]: new CharUiLineInputDotsWithVariantsListElement({
                data: {
                    keeper,
                    valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.BACKGROUNDS],
                    showHeader: true,
                },
                validations: {
                    validations: validations,
                    partValidations: validations[CHAR_PARTS.BACKGROUNDS],
                    dataForValidations: validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.MERITS]: new CharUiLineInputPointsWithVariantsListElement({
                data: {
                    keeper,
                    valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.MERITS],
                },
                validations: {
                    validations: validations,
                    partValidations: validations[CHAR_PARTS.MERITS],
                    dataForValidations: validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.FLAWS]: new CharUiLineInputPointsWithVariantsListElement({
                data: {
                    keeper,
                    valueInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.FLAWS],
                },
                validations: {
                    validations: validations,
                    partValidations: validations[CHAR_PARTS.FLAWS],
                    dataForValidations: validationsInfo,
                },
                updateEvent: updateEvent,
            }),
        };
    }

    createCharacterUi(parts) {
        const resultBuilder = DTableBuilder.init();

        resultBuilder.addRow().addData()
            .appendChilds(parts[CHAR_PARTS.ATTRIBUTES].getElement());
        resultBuilder.addRow().addData()
            .appendChilds(parts[CHAR_PARTS.ABILITIES].getElement());
        resultBuilder.addRow().addData()
            .appendChilds(parts[CHAR_PARTS.SPHERES].getElement());

        const aweBuilder = DTableBuilder.init();
        const aweRowBuilder = aweBuilder.addRow();
        aweRowBuilder.addData().appendChilds(parts[CHAR_PARTS.ARETE].getElement());
        aweRowBuilder.addData().appendChilds(parts[CHAR_PARTS.WILLPOWER].getElement());
        aweRowBuilder.addData().appendChilds(parts[CHAR_PARTS.EXPERIENCE].getElement());

        resultBuilder.addRow().addData()
            .appendChilds(aweBuilder.create());

        const bmlBuilder = DTableBuilder.init();
        const bmlRowBuilder = bmlBuilder.addRow();
        bmlRowBuilder.addData().appendChilds(parts[CHAR_PARTS.BACKGROUNDS].getElement());
        bmlRowBuilder.addData().appendChilds(parts[CHAR_PARTS.MERITS].getElement());
        bmlRowBuilder.addData().appendChilds(parts[CHAR_PARTS.FLAWS].getElement());

        resultBuilder.addRow().addData()
            .appendChilds(bmlBuilder.create());

        return resultBuilder.create();
    }
}

const main = new CharSheetEntryPoint({
    version: CHAR_SHEET_VERSION,
    statesOrder: editStatesForTabsOrder,
    CharStateClass: CharacterMtAState,
    validations: CHAR_VALIDATIONS,
    translations: CHAR_VALUES_TRANSLATIONS,
    htmlBody: document.body,
    configTabHeader: CHAR_SETTINGS_TRANSLATION,
});