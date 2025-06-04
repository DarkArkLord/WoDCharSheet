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
    MAGICK_BUTTON: 'magick-button magick-button-two',
    WIDTH_100: 'width-100',
    NO_PADDING: 'no-padding',
});

const EMPTY_STRING = '';
const NOTES_FIELD = 'notes';

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
    constructor(dataKeeper, updateEvent, tabText, entryPoint) {
        const instance = this;
        updateEvent.addHandler(() => instance.update());

        // Text elements
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

        const notesTextElement = DElementBuilder.initTextArea()
            .setAttribute(ATTRIBUTES.COLS, 45)
            .setAttribute(ATTRIBUTES.ROWS, 45)
            .setEvent(EVENTS.INPUT, input => {
                const text = input?.target?.value?.trim() ?? EMPTY_STRING;
                entryPoint.setNotes(text);
                updateEvent.invoke();
            })
            .create();

        // Buttons
        const exportButton = DElementBuilder.initDiv()
            .setAttribute(ATTRIBUTES.CLASS, CSS.MAGICK_BUTTON)
            .appendChilds('Экспорт в файл')
            .setEvent(EVENTS.CLICK, () => {
                const data = instance.getCharDataJSON();
                const blob = new Blob([data], { type: 'text/plain' });

                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                // Нужен генератор имени, мб от даты + версии
                link.download = 'wodCharSheet.txt';

                link.click();

                URL.revokeObjectURL(link.href);
                link.remove();
            })
            .create();

        const importButton = DElementBuilder.initDiv()
            .setAttribute(ATTRIBUTES.CLASS, CSS.MAGICK_BUTTON)
            .appendChilds('Импорт')
            .setEvent(EVENTS.CLICK, () => {
                const input = importTextElement.getValue()?.trim() ?? EMPTY_STRING;
                try {
                    const parsed = JSON.parse(input);
                    dataKeeper.charData = parsed;

                    // Внутри Character поля создаются через
                    // const value = keeper[key] = keeper[key] ?? {}
                    // из-за чего при загрузке новых данных в keeper
                    // внутри Character остаются старые ссылки.
                    // Для решения проблемы требуется пересоздание Character.
                    entryPoint.reCreateCharacter();
                    entryPoint.rebind();

                    updateEvent.invoke();
                } catch (ex) {
                    alert(ex)
                }
            })
            .create();

        const importFileButton = DElementBuilder.initDiv()
            .setAttribute(ATTRIBUTES.CLASS, CSS.MAGICK_BUTTON)
            .appendChilds('Импорт в файл')
            .setEvent(EVENTS.CLICK, () => {
                const fileElement = document.createElement('input');
                fileElement.type = 'file';
                fileElement.style.display = 'none';

                fileElement.click();

                fileElement.onchange = (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();

                        reader.onload = (readerEvent) => {
                            const input = readerEvent.target.result ?? EMPTY_STRING;
                            try {
                                const parsed = JSON.parse(input);
                                dataKeeper.charData = parsed;

                                // Внутри Character поля создаются через
                                // const value = keeper[key] = keeper[key] ?? {}
                                // из-за чего при загрузке новых данных в keeper
                                // внутри Character остаются старые ссылки.
                                // Для решения проблемы требуется пересоздание Character.
                                entryPoint.reCreateCharacter();
                                entryPoint.rebind();

                                updateEvent.invoke();
                            } catch (ex) {
                                alert(ex)
                            }
                        };

                        reader.readAsText(file, 'UTF-8');
                    }

                    fileElement.remove();
                };
            })
            .create();

        // Configure table
        const exportTable = DTableBuilder.init();
        const exportTableRow = exportTable.addRow();
        exportTableRow.addData()
            .setAttribute(ATTRIBUTES.CLASS, `${CSS.TEXT_ALIGN_CENTER} ${CSS.WIDTH_100}`)
            .appendChilds('Экспорт');
        exportTableRow.addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .appendChilds(exportButton);

        const importTable = DTableBuilder.init();
        importTable.getBuilder()
            .setAttribute(ATTRIBUTES.CLASS, CSS.NO_PADDING);

        const importTableRow = importTable.addRow();
        importTableRow.getBuilder()
            .setAttribute(ATTRIBUTES.CLASS, CSS.NO_PADDING);
        importTableRow.addData()
            .setAttribute(ATTRIBUTES.CLASS, `${CSS.TEXT_ALIGN_CENTER} ${CSS.WIDTH_100} ${CSS.NO_PADDING}`)
            .appendChilds(importButton);
        importTableRow.addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .appendChilds(importFileButton);

        const contentTable = DTableBuilder.init();

        const headersRow = contentTable.addRow();
        headersRow.addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .appendChilds(exportTable.create());
        headersRow.addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .appendChilds(importTable.create());
        headersRow.addData()
            .setAttribute(ATTRIBUTES.CLASS, CSS.TEXT_ALIGN_CENTER)
            .appendChilds('Заметки');

        const contentRow = contentTable.addRow();
        contentRow.addData().appendChilds(exportTextElement);
        contentRow.addData().appendChilds(importTextElement);
        contentRow.addData().appendChilds(notesTextElement);

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
            entryPoint,
            elements: {
                text: {
                    exportElement: exportTextElement,
                    import: importTextElement,
                    notes: notesTextElement,
                },
                buttons: {
                    exportFile: exportButton,
                    import: importButton,
                    importFile: importFileButton,
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

    getCharDataJSON() {
        return JSON.stringify(this.inner.dataKeeper?.charData ?? {}, null, 2);
    }

    update() {
        const textElements = this.inner.elements.text;

        const charText = this.getCharDataJSON();
        textElements.exportElement.setValue(charText);

        const notes = this.inner.entryPoint.getNotes();
        textElements.notes.setValue(notes);
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

        const charVersion = this.inner.dataKeeper.charData?.version;
        const appVersion = this.inner.version;
        if (charVersion !== appVersion) {
            errorTexts.push(`Несоответствие версий! Персонаж создан в версии ${charVersion}, текущая версия ${appVersion}. Для персонажей, загруженных из иных версий, корректная работа не гарантируется.`)
        }

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

        const characterInput = {
            dataKeeper,
            updateEvent,
            statesOrder,
            CharStateClass,
            validations,
            translations,
            version,
        };
        const character = new CharacterBase(characterInput);

        const configTab = new ConfigTab(dataKeeper, updateEvent, configTabHeader, this);

        this.inner = {
            characterInput,
            dataKeeper,
            updateEvent,
            elements: {
                character,
                configTab,
            },
            htmlBody
        };
    }

    reCreateCharacter() {
        const character = new CharacterBase(this.inner.characterInput);
        this.inner.elements.character = character;
        return character;
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

    getNotes() {
        return this.inner.dataKeeper.charData[NOTES_FIELD] ?? EMPTY_STRING;
    }

    setNotes(text) {
        this.inner.dataKeeper.charData[NOTES_FIELD] = text;
    }
}