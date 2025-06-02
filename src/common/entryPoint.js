import { configureDarkTabsAndButtons } from '../common/tabs.js'

import { DElementBuilder, ATTRIBUTES, EVENTS, ACTIONS, DTableBuilder, DTableRowBuilder } from '../common/domWrapper.js'
import { DarkEvent, } from '../common/utilities.js'
import { UIText, UITextList, } from '../common/uiElements.js'
import { CharUiLineDotsSectionsPartElement, CharUiBlockDotsElement, CharUiLineInputDotsWithVariantsListElement, CharUiLineInputPointsWithVariantsListElement, CharUiBlockPointsElement } from '../common/charElements.js'

const CSS = Object.freeze({
    TAB_BUTTON: 'tab-button',
    TAB_CONTENT: 'tab-content',
    TEXT_ALIGN_CENTER: 'text-align-center',
    VERTICAL_ALIGN_TOP: 'vertical-align-top',
    BORDER_BLACK_1: 'border-black-1',
    BORDER_RED_1: 'border-red-1',
    TAB_BUTTONS_CONTAINER: 'tab-buttons-container',
});

const EMPTY_STRING = '';

export class CharacterBaseState {
    constructor(input) {
        const {
            keeper,
            validations,
            updateEvent,
            translations,
        } = input;

        const validationsInfo = { state: validations.stateTranslation };
        const parts = this.createPartsElements({ keeper, validations, updateEvent, validationsInfo });
        const characterUi = this.createCharacterUi(parts);

        const errorsList = new UITextList();
        const errorsElement = this.createErrorsElement(errorsList);

        const tabContent = this.createTabContent(characterUi, errorsElement);

        const tabContainer = DElementBuilder.initDiv()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TAB_CONTENT)
            .appendChilds(tabContent)
            .create();

        const tabButtonText = new UIText(validations.stateTranslation, {});
        const tabButtonContainer = DElementBuilder.initDiv()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TAB_BUTTON)
            .appendChilds(tabButtonText.getElement())
            .create();

        this.inner = {
            updateEvent,
            data: keeper,
            validations: {
                info: validationsInfo,
                main: validations,
                translations,
            },
            elements: {
                parts,
                characterUi,
                errorsList,
                errorsElement,
                tabContent,
                tabContainer,
                tabButtonText,
                tabButtonContainer,
            },
        };
    }

    createPartsElements(input) {
        throw new Error(`Not implemented exception`);
        return {};
    }

    createCharacterUi(parts) {
        throw new Error(`Not implemented exception`);
        const resultBuilder = DTableBuilder.init();
        return resultBuilder.create();
    }

    createErrorsElement(errorsList) {
        const errorsElementBuilder = DTableBuilder.init();
        errorsElementBuilder.getBuilder()
            .setAttribute(ATTRIBUTES.CLASS, CSS.BORDER_BLACK_1);

        errorsElementBuilder.addRow().addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .appendChilds('Ошибки');
        errorsElementBuilder.addRow().addData()
            .appendChilds(errorsList.getElement());

        return errorsElementBuilder.create();
    }

    createTabContent(characterUi, errorsElement) {
        const tabContentBuilder = DTableBuilder.init();
        const tabContentRowBuilder = tabContentBuilder.addRow();
        tabContentRowBuilder.addData()
            .appendChilds(characterUi);
        tabContentRowBuilder.addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.VERTICAL_ALIGN_TOP)
            .appendChilds(errorsElement);

        return tabContentBuilder.create();
    }

    getErrorsList() {
        return this.inner.elements.errorsList;
    }

    getTabButton() {
        return this.inner.elements.tabButtonContainer;
    }

    getTabContent() {
        return this.inner.elements.tabContainer;
    }

    update() {
        const elements = this.inner.elements;
        for (const part of Object.values(elements.parts)) {
            part.update();
        }

        elements.tabButtonText.setText(`${this.inner.validations.main.stateTranslation} (${this.getPrice()})`);
    }

    validate() {
        const elements = this.inner.elements;
        const validations = this.inner.validations.main;
        const errors = Object.values(elements.parts).flatMap(part => part.validate() ?? []) ?? [];

        if (validations?.freePoints) {
            const price = this.getPrice();

            if (price !== validations.freePoints) {
                errors.push({
                    ...this.inner.validations.info,
                    text: `Должно быть распределено ${validations.freePoints} точек (сейчас ${price})`,
                });
            }
        }

        if (validations?.freePointsField) {
            const freePointsCount = this.inner.data[validations.freePointsField];

            if (freePointsCount === undefined || freePointsCount === '' || Number.isNaN(freePointsCount)) {
                errors.push({
                    ...this.inner.validations.info,
                    text: `Поле "${this.inner.validations.translations[validations.freePointsField]?.translation}" должно быть заполнено числом`,
                });
            } else {
                const price = this.getPrice();
                if (price > freePointsCount) {
                    errors.push({
                        ...this.inner.validations.info,
                        text: `Не может быть распределено больше ${freePointsCount} очков (сейчас ${price})`,
                    });
                }
            }
        }

        // Highlight Border
        if (errors.length > 0) {
            elements.tabButtonContainer.addClass(CSS.BORDER_RED_1);
            elements.tabContainer.addClass(CSS.BORDER_RED_1);
        } else {
            elements.tabButtonContainer.removeClass(CSS.BORDER_RED_1);
            elements.tabContainer.removeClass(CSS.BORDER_RED_1);
        }

        return errors;
    }

    getPrice() {
        return Object.values(this.inner.elements.parts).reduce((acc, cur) => acc += cur.getPrice(), 0);
    }
}

class ConfigTab {
    constructor(dataKeeper, updateEvent, tabText) {
        const instance = this;
        updateEvent.addHandler(() => instance.update());

        // Content
        const exportTextElement = DElementBuilder.initTextArea()
            .setAttribute(ATTRIBUTES.COLS, 45)
            .setAttribute(ATTRIBUTES.ROWS, 45)
            .setAttribute(ATTRIBUTES.READ_ONLY, true)
            .setAttribute(ATTRIBUTES.DISABLED, true)
            .create();

        const importTextElement = DElementBuilder.initTextArea()
            .setAttribute(ATTRIBUTES.COLS, 45)
            .setAttribute(ATTRIBUTES.ROWS, 45)
            .create();

        const importButton = DElementBuilder.initDiv()
            .appendChilds('Импорт')
            .create();

        // Configure table
        const contentTable = DTableBuilder.init();

        const headersRow = contentTable.addRow();
        headersRow.addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .appendChilds('Экспорт');
        headersRow.addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .appendChilds(importButton);

        const textRow = contentTable.addRow();
        textRow.addData().appendChilds(exportTextElement);
        textRow.addData().appendChilds(importTextElement);

        // Finalize
        const tabContent = DElementBuilder.initDiv()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TAB_CONTENT)
            .appendChilds(contentTable.create())
            .create();

        const tabButton = DElementBuilder.initDiv()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TAB_BUTTON)
            .appendChilds(tabText)
            .create();

        this.inner = {
            dataKeeper,
            updateEvent,
            elements: {
                inner: {
                    export: exportTextElement,
                },
                tabButton,
                tabContent,
            },
        };
    }

    getTabButton() {
        return this.inner.elements.tabButton;
    }

    getTabContent() {
        return this.inner.elements.tabContent;
    }

    update() {
        const text = JSON.stringify(this.inner.dataKeeper?.charData ?? {}, null, 2);
        this.inner.elements.inner.export.setValue(text);
    }
}

class CharacterBase {
    constructor(input) {
        const {
            dataKeeper,
            updateEvent,
            statesOrder,
            CharStateClass = CharacterBaseState,
            validations,
            translations,
            version,
        } = input;

        const instance = this;
        updateEvent.addHandler(() => instance.update());

        const states = {};
        for (const state of statesOrder) {
            states[state] = new CharStateClass({
                keeper: dataKeeper.charData,
                validations: validations[state],
                updateEvent,
                translations,
            });
        }

        this.inner = {
            dataKeeper,
            version,
            updateEvent,
            states,
            statesOrder,
            validations,
        };
    }

    getTabsInfo() {
        const states = this.inner.states;
        return this.inner.statesOrder.map(editState => ({
            button: states[editState].getTabButton(),
            content: states[editState].getTabContent(),
        }));
    }

    update() {
        const states = Object.values(this.inner.states);

        for (const state of states) {
            state.update();
        }

        const errors = states.flatMap(state => state.validate() ?? []) ?? [];
        const errorTexts = errors.map(error => [
            error.state, error.part, error.section, error.value, error.commonValue, error.text
        ].filter(x => x).join(': ')) ?? [];

        for (const state of states) {
            const errorsList = state.getErrorsList();
            errorsList.clear();

            for (const error of errorTexts) {
                errorsList.addItem(error, { class: CSS.BORDER_RED_1 });
            }
        }
    }
}

export class CharSheetEntryPoint {
    constructor(input) {
        const {
            version,
            statesOrder,
            CharStateClass,
            validations,
            translations,
            htmlBody,
            configTabHeader,
        } = input;

        const dataKeeper = { charData: { version } };

        const updateEvent = new DarkEvent();

        const character = new CharacterBase({
            dataKeeper,
            updateEvent,
            statesOrder,
            CharStateClass,
            validations,
            translations,
            version,
        });

        const configTab = new ConfigTab(dataKeeper, updateEvent, configTabHeader);

        this.inner = {
            dataKeeper,
            updateEvent,
            elements: {
                character,
                configTab,
            },
            htmlBody
        };
    }

    updateInvoke() {
        this.inner.updateEvent.invoke();
    }

    rebind() {
        const headersContainer = DElementBuilder.initDiv()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TAB_BUTTONS_CONTAINER)
            .create();

        const tabsContainer = DElementBuilder.initDiv()
            .create();

        const elements = this.inner.elements;
        const tabs = elements.character.getTabsInfo();
        tabs.push({
            button: elements.configTab.getTabButton(),
            content: elements.configTab.getTabContent(),
        });

        for (const tab of tabs) {
            headersContainer.appendChilds(tab.button);
            tabsContainer.appendChilds(tab.content);
        }

        const htmlBody = this.inner.htmlBody;
        htmlBody.innerHTML = EMPTY_STRING;
        htmlBody.append(
            headersContainer.getElement(),
            tabsContainer.getElement(),
        );

        configureDarkTabsAndButtons({
            tabs: tabs,
            activeTabIndex: 0,
            activeStyleClass: 'active',
        });
    }
}