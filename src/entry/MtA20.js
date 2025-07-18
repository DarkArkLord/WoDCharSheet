import '../common/styles.js'

const CHAR_SHEET_NAME = 'Dark MtA 20th Char Sheet'
const CHAR_SHEET_VERSION = 'v0.10.2';
const CHAR_SHEET_TITLE = `${CHAR_SHEET_NAME} ${CHAR_SHEET_VERSION}`;

document.title = CHAR_SHEET_TITLE;
document.getElementById('page-title').innerHTML = CHAR_SHEET_TITLE;

import { DTableBuilder } from '../common/domWrapper.js'
import { CharUi_Part_TextArea, CharUi_Part_LineDots, CharUi_Element_BlockDots, CharUi_Element_LineInputDotsWithVariantsList, CharUi_Element_LineInputPointsWithVariantsList, CharUi_Element_BlockPoints } from '../common/charElements.js'

import { CharacterBaseState, CharSheetEntryPoint } from '../common/entryPoint.js'
import { CHAR_PARTS, CHAR_VALUES_TRANSLATIONS, CHAR_EDIT_STATES, CHAR_SETTINGS_TRANSLATION, CHAR_VALIDATIONS } from '../setting/MtA20.js'


const editStatesForTabsOrder = [CHAR_EDIT_STATES.BASE, CHAR_EDIT_STATES.POINTS, CHAR_EDIT_STATES.EXP, CHAR_EDIT_STATES.TOTAL];

class CharacterMtAState extends CharacterBaseState {
    constructor(input) { super(input); }

    createPartsElements(input) {
        const { keeper, validations, updateEvent, validationsInfo } = input;
        return {
            [CHAR_PARTS.HEADER]: new CharUi_Part_TextArea({
                data: {
                    keeper,
                    partInfo: CHAR_VALUES_TRANSLATIONS[CHAR_PARTS.HEADER],
                },
                validations: {
                    validations: validations,
                    dataForValidations: validationsInfo,
                },
                updateEvent: updateEvent,
            }),
            [CHAR_PARTS.ATTRIBUTES]: new CharUi_Part_LineDots({
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
            [CHAR_PARTS.ABILITIES]: new CharUi_Part_LineDots({
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
            [CHAR_PARTS.SPHERES]: new CharUi_Part_LineDots({
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
            [CHAR_PARTS.ARETE]: new CharUi_Element_BlockDots({
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
            [CHAR_PARTS.WILLPOWER]: new CharUi_Element_BlockDots({
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
            [CHAR_PARTS.EXPERIENCE]: new CharUi_Element_BlockPoints({
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
            [CHAR_PARTS.BACKGROUNDS]: new CharUi_Element_LineInputDotsWithVariantsList({
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
            [CHAR_PARTS.MERITS]: new CharUi_Element_LineInputPointsWithVariantsList({
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
            [CHAR_PARTS.FLAWS]: new CharUi_Element_LineInputPointsWithVariantsList({
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
            .appendChilds(parts[CHAR_PARTS.HEADER].getElement());
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
    htmlBody: document.getElementById('main-container'),
    configTabHeader: CHAR_SETTINGS_TRANSLATION,
});

main.getUpdateEvent().invoke();
main.rebind();