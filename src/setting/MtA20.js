const CHAR_MERIT_FLAW_TYPE = Object.freeze({
    PHYSICAL: 'Физ',
    MENTAL: 'Мен',
    SOCIAL: 'Соц',
});

export const CHAR_PARTS = Object.freeze({
    HEADER: 'header',
    ATTRIBUTES: 'attributes',
    ABILITIES: 'abilities',
    SPHERES: 'spheres',
    BACKGROUNDS: 'backgrounds',
    ARETE: 'arete',
    WILLPOWER: 'willpower',
    QUINTESSENCE: 'quintessence',
    PARADOX: 'paradox',
    HEALTH: 'health',
    EXPERIENCE: 'experience',
    OTHER_TRAITS: 'otherTraits',
    MERITS: 'merits',
    FLAWS: 'flaws',
});

export const CHAR_VALUES_TRANSLATIONS = Object.freeze({
    [CHAR_PARTS.HEADER]: {
        id: CHAR_PARTS.HEADER, translation: 'Заголовок',
        sections: [
            {
                values: [
                    { id: 'Name', translation: 'Имя', },
                    { id: 'Player', translation: 'Игрок', },
                    { id: 'Chronicle', translation: 'Хроника', },
                ],
            },
            {
                values: [
                    { id: 'Nature', translation: 'Натура', },
                    { id: 'Demeanor', translation: 'Маска', },
                    { id: 'Essence', translation: 'Аватар', },
                ],
            },
            {
                values: [
                    { id: 'Affiliation', translation: 'Фракция', },
                    { id: 'Sect', translation: 'Секта', },
                    { id: 'Concept', translation: 'Концепция', },
                ],
            },
        ]
    },
    [CHAR_PARTS.ATTRIBUTES]: {
        id: CHAR_PARTS.ATTRIBUTES, translation: 'Атрибуты',
        sections: [
            {
                id: 'Physical', translation: 'Физические',
                values: [
                    { id: 'Strength', translation: 'Сила', },
                    { id: 'Dexterity', translation: 'Ловкость', },
                    { id: 'Stamina', translation: 'Выносливость', },
                ]
            },
            {
                id: 'Social', translation: 'Социальные',
                values: [
                    { id: 'Charisma', translation: 'Харизма', },
                    { id: 'Manipulation', translation: 'Манипуляция', },
                    { id: 'Appearance', translation: 'Внешность', },
                ]
            },
            {
                id: 'Mental', translation: 'Ментальные',
                values: [
                    { id: 'Perception', translation: 'Восприятие', },
                    { id: 'Intelligence', translation: 'Интеллект', },
                    { id: 'Wits', translation: 'Смекалка', },
                ]
            },
        ],
    },
    [CHAR_PARTS.ABILITIES]: {
        id: CHAR_PARTS.ABILITIES, translation: 'Способности',
        sections: [
            {
                id: 'Talents', translation: 'Таланты',
                values: [
                    { id: 'Alertness', translation: 'Внимательность', },
                    { id: 'Art', translation: 'Искусство', specialtyEditableFrom: 1, },
                    { id: 'Athletics', translation: 'Атлетика', },
                    { id: 'Awareness', translation: 'Шестое чувство', },
                    { id: 'Brawl', translation: 'Драка', },
                    { id: 'Empathy', translation: 'Эмпатия', },
                    { id: 'Expression', translation: 'Красноречие', },
                    { id: 'Intimidation', translation: 'Запугивание', },
                    { id: 'Leadership', translation: 'Лидерство', },
                    { id: 'Streetwise', translation: 'Знание улиц', },
                    { id: 'Subterfuge', translation: 'Хитрость', },
                ]
            },
            {
                id: 'Skills', translation: 'Навыки',
                values: [
                    { id: 'Crafts', translation: 'Ремесло', specialtyEditableFrom: 1, },
                    { id: 'Drive', translation: 'Вождение', },
                    { id: 'Etiquette', translation: 'Этикет', },
                    { id: 'Firearms', translation: 'Стрельба', },
                    { id: 'Martial Arts', translation: 'Боевые искусства', },
                    { id: 'Meditation', translation: 'Медитация', },
                    { id: 'Melee', translation: 'Фехтование', },
                    { id: 'Research', translation: 'Исследование', },
                    { id: 'Stealth', translation: 'Скрытность', },
                    { id: 'Survival', translation: 'Выживание', },
                    { id: 'Technology', translation: 'Электроника', },
                ]
            },
            {
                id: 'Knowledges', translation: 'Знания',
                values: [
                    { id: 'Academics', translation: 'Академизм', },
                    { id: 'Computer', translation: 'Информатика', },
                    { id: 'Cosmology', translation: 'Космология', },
                    { id: 'Enigmas', translation: 'Загадки', },
                    { id: 'Esoterica', translation: 'Эзотерика', },
                    { id: 'Investigation', translation: 'Расследование', },
                    { id: 'Law', translation: 'Законы', },
                    { id: 'Medicine', translation: 'Медицина', },
                    { id: 'Occult', translation: 'Оккультизм', },
                    { id: 'Politics', translation: 'Политика', },
                    { id: 'Science', translation: 'Наука', },
                ]
            },
        ],
    },
    [CHAR_PARTS.SPHERES]: {
        id: CHAR_PARTS.SPHERES, translation: 'Сферы',
        sections: [
            {
                values: [
                    { id: 'Correspondence', translation: 'Связи', },
                    { id: 'Entropy', translation: 'Энтропия', },
                    { id: 'Forces', translation: 'Силы', },
                ]
            },
            {
                values: [
                    { id: 'Life', translation: 'Жизнь', },
                    { id: 'Matter', translation: 'Материя', },
                    { id: 'Mind', translation: 'Разум', },
                ]
            },
            {
                values: [
                    { id: 'Prime', translation: 'Основы', },
                    { id: 'Spirit', translation: 'Дух', },
                    { id: 'Time', translation: 'Время', },
                ]
            },
        ]
    },
    [CHAR_PARTS.BACKGROUNDS]: {
        id: CHAR_PARTS.BACKGROUNDS, translation: 'Факты биографии',
        variants: [
            { id: 'Avatar', translation: 'Аватар', },
            { id: 'TestBackground', translation: 'ТестБио', },
        ],
    },
    [CHAR_PARTS.ARETE]: { id: CHAR_PARTS.ARETE, translation: 'Арете', },
    [CHAR_PARTS.WILLPOWER]: { id: CHAR_PARTS.WILLPOWER, translation: 'Сила воли', },
    [CHAR_PARTS.QUINTESSENCE]: { id: CHAR_PARTS.QUINTESSENCE, translation: 'Квинтэссенция', },
    [CHAR_PARTS.PARADOX]: { id: CHAR_PARTS.PARADOX, translation: 'Парадокс', },
    [CHAR_PARTS.HEALTH]: {
        id: CHAR_PARTS.HEALTH, translation: 'Здоровье',
        levels: [
            { id: 'Bruised', translation: 'Задет', penalty: '-0', },
            { id: 'Hurt', translation: 'Поврежден', penalty: '-1', },
            { id: 'Injured', translation: 'Ранен', penalty: '-1', },
            { id: 'Wounded', translation: 'Тяжело ранен', penalty: '-2', },
            { id: 'Mauled', translation: 'Травмирован', penalty: '-2', },
            { id: 'Crippled', translation: 'Искалечен', penalty: '-5', },
            { id: 'Incapacitated', translation: 'Недееспособен', penalty: '  ', },
        ]
    },
    [CHAR_PARTS.EXPERIENCE]: { id: CHAR_PARTS.EXPERIENCE, translation: 'Опыт', },
    [CHAR_PARTS.OTHER_TRAITS]: {
        id: CHAR_PARTS.OTHER_TRAITS, translation: 'Другие параметры',
        variants: [
            { id: 'TestOtherTrait1', translation: 'ТестДрПар1', },
            { id: 'TestOtherTrait2', translation: 'ТестДрПар2', },
        ],
    },
    [CHAR_PARTS.MERITS]: {
        id: CHAR_PARTS.MERITS, translation: 'Достоинства',
        variants: [
            { id: 'TestMerit1', translation: 'ТестДост1', type: CHAR_MERIT_FLAW_TYPE.SOCIAL, points: [1, 3, 5] },
            { id: 'TestMerit2', translation: 'ТестДост2', type: CHAR_MERIT_FLAW_TYPE.PHYSICAL, points: [2, 4, 6] },
        ],
    },
    [CHAR_PARTS.FLAWS]: {
        id: CHAR_PARTS.FLAWS, translation: 'Недостатки',
        variants: [
            { id: 'TestFlaw1', translation: 'ТестНед1', type: CHAR_MERIT_FLAW_TYPE.SOCIAL, points: [1, 2, 3] },
            { id: 'TestFlaw2', translation: 'ТестНед2', type: CHAR_MERIT_FLAW_TYPE.MENTAL, points: [4, 5, 6] },
        ],
    },
    // Add second page and other
    aaaaaaaaa: { id: 'Aaaaaaa', translation: 'Aaaaaaaaa', },
});

export const CHAR_EDIT_STATES = Object.freeze({
    BASE: 'base',
    POINTS: 'points',
    EXP: 'exp',
    TOTAL: 'total'
});

export const CHAR_EDIT_STATES_TRANSLATIONS = Object.freeze({
    [CHAR_EDIT_STATES.BASE]: 'Основа',
    [CHAR_EDIT_STATES.POINTS]: 'Свободные точки',
    [CHAR_EDIT_STATES.EXP]: 'Опыт',
    [CHAR_EDIT_STATES.TOTAL]: 'Итог',
});

export const CHAR_SETTINGS_TRANSLATION = 'Настройки';

const DEFAULT_POINTS_COUNT_5 = 5;
const DEFAULT_POINTS_COUNT_10 = 10;

export const CHAR_VALIDATIONS = Object.freeze({
    [CHAR_EDIT_STATES.BASE]: {
        editable: true,
        state: CHAR_EDIT_STATES.BASE,
        stateTranslation: CHAR_EDIT_STATES_TRANSLATIONS[CHAR_EDIT_STATES.BASE],
        prev: [],
        next: [CHAR_EDIT_STATES.POINTS, CHAR_EDIT_STATES.EXP],
        [CHAR_PARTS.ATTRIBUTES]: {
            editable: true,
            sectionPoints: [7 + 3, 5 + 3, 3 + 3],
            specialtyEditableFrom: 4,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                min: 1,
                price: (total) => 1,
            },
        },
        [CHAR_PARTS.ABILITIES]: {
            editable: true,
            sectionPoints: [13, 9, 5],
            specialtyEditableFrom: 4,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                min: 0,
                max: 3,
                price: (total) => 1,
            },
        },
        [CHAR_PARTS.SPHERES]: {
            editable: true,
            freePoints: 6,
            specialtyEditableFrom: 4,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                min: 0,
                price: (total) => 1,
            },
        },
        [CHAR_PARTS.BACKGROUNDS]: {
            editable: true,
            freePoints: 7,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                min: 0,
                price: (total) => 1,
            },
        },
        [CHAR_PARTS.ARETE]: {
            editable: false,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_10,
                min: 1,
                max: 1,
            },
        },
        [CHAR_PARTS.WILLPOWER]: {
            editable: false,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_10,
                min: 5,
                max: 5,
            },
        },
        [CHAR_PARTS.EXPERIENCE]: {
            editable: false,
        },
        [CHAR_PARTS.MERITS]: {
            editable: false,
        },
        [CHAR_PARTS.FLAWS]: {
            editable: false,
        },
    },
    [CHAR_EDIT_STATES.POINTS]: {
        editable: true,
        state: CHAR_EDIT_STATES.POINTS,
        stateTranslation: CHAR_EDIT_STATES_TRANSLATIONS[CHAR_EDIT_STATES.POINTS],
        prev: [CHAR_EDIT_STATES.BASE],
        next: [CHAR_EDIT_STATES.EXP],
        freePoints: 15,
        [CHAR_PARTS.ATTRIBUTES]: {
            editable: true,
            specialtyEditableFrom: 4,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                min: 0,
                price: (total) => 5,
            },
        },
        [CHAR_PARTS.ABILITIES]: {
            editable: true,
            specialtyEditableFrom: 4,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                min: 0,
                price: (total) => 2,
            },
        },
        [CHAR_PARTS.SPHERES]: {
            editable: true,
            specialtyEditableFrom: 4,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                min: 0,
                price: (total) => 7,
            },
        },
        [CHAR_PARTS.BACKGROUNDS]: {
            editable: true,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                min: 0,
                totalMin: 0,
                price: (total) => 1,
            },
        },
        [CHAR_PARTS.ARETE]: {
            editable: true,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_10,
                min: 0,
                totalMax: 3,
                price: (total) => 4,
            },
        },
        [CHAR_PARTS.WILLPOWER]: {
            editable: true,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_10,
                min: 0,
                price: (total) => 1,
            },
        },
        [CHAR_PARTS.EXPERIENCE]: {
            editable: false,
        },
        [CHAR_PARTS.MERITS]: {
            editable: true,
            pointsInput: {
                negativePrice: false,
                min: 0,
            },
        },
        [CHAR_PARTS.FLAWS]: {
            editable: true,
            listInput: {
                maxPointsSum: 7,
            },
            pointsInput: {
                negativePrice: true,
                min: 0,
            },
        },
    },
    [CHAR_EDIT_STATES.EXP]: {
        editable: true,
        state: CHAR_EDIT_STATES.EXP,
        stateTranslation: CHAR_EDIT_STATES_TRANSLATIONS[CHAR_EDIT_STATES.EXP],
        prev: [CHAR_EDIT_STATES.BASE, CHAR_EDIT_STATES.POINTS],
        next: [],
        freePointsField: CHAR_PARTS.EXPERIENCE,
        [CHAR_PARTS.ATTRIBUTES]: {
            editable: true,
            specialtyEditableFrom: 4,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                min: 0,
                price: (total) => total * 4,
            },
        },
        [CHAR_PARTS.ABILITIES]: {
            editable: true,
            specialtyEditableFrom: 4,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                min: 0,
                price: (total) => total == 0 ? 3 : total * 2,
            },
        },
        [CHAR_PARTS.SPHERES]: {
            editable: true,
            specialtyEditableFrom: 4,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                min: 0,
                price: (total) => total == 0 ? 10 : total * 8,
                alternatePrice: (total) => total == 0 ? 10 : total * 7, // Add Affinity/Other Sphere
            },
        },
        [CHAR_PARTS.BACKGROUNDS]: {
            editable: true,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                min: 0,
                price: (total) => total * 3,
            },
        },
        [CHAR_PARTS.ARETE]: {
            editable: true,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_10,
                min: 0,
                price: (total) => total * 8,
            },
        },
        [CHAR_PARTS.WILLPOWER]: {
            editable: true,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_10,
                min: 0,
                price: (total) => total,
            },
        },
        [CHAR_PARTS.EXPERIENCE]: {
            editable: true,
            pointsInput: {
                min: 0,
            },
        },
        [CHAR_PARTS.MERITS]: {
            editable: false,
        },
        [CHAR_PARTS.FLAWS]: {
            editable: false,
        },
    },
    [CHAR_EDIT_STATES.TOTAL]: {
        editable: false,
        state: undefined,
        stateTranslation: CHAR_EDIT_STATES_TRANSLATIONS[CHAR_EDIT_STATES.TOTAL],
        prev: [CHAR_EDIT_STATES.BASE, CHAR_EDIT_STATES.POINTS, CHAR_EDIT_STATES.EXP],
        next: [],
        [CHAR_PARTS.ATTRIBUTES]: {
            editable: false,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                totalMin: 1,
                totalMax: 5,
            },
        },
        [CHAR_PARTS.ABILITIES]: {
            editable: false,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                totalMin: 0,
                totalMax: 5,
            },
        },
        [CHAR_PARTS.SPHERES]: {
            editable: false,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                totalMin: 0,
                totalMax: 5,
            },
        },
        [CHAR_PARTS.BACKGROUNDS]: {
            editable: false,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_5,
                totalMin: 1,
                totalMax: 5,
            },
        },
        [CHAR_PARTS.ARETE]: {
            editable: false,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_10,
                totalMin: 1,
                totalMax: 10,
            },
        },
        [CHAR_PARTS.WILLPOWER]: {
            editable: false,
            dotsInput: {
                dotsCount: DEFAULT_POINTS_COUNT_10,
                totalMin: 0,
                totalMax: 10,
            },
        },
        [CHAR_PARTS.EXPERIENCE]: {
            editable: false,
        },
        [CHAR_PARTS.MERITS]: {
            editable: false,
        },
        [CHAR_PARTS.FLAWS]: {
            editable: false,
        },
    },
});
