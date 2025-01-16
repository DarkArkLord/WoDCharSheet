export const CHAR_SECTIONS = Object.freeze({
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
});

export const CHAR_VALUES_TRANSLATIONS = Object.freeze({
    header: [
        [
            { id: 'Name', translation: 'Имя', },
            { id: 'Player', translation: 'Игрок', },
            { id: 'Chronicle', translation: 'Хроника', },
        ],
        [
            { id: 'Nature', translation: 'Натура', },
            { id: 'Demeanor', translation: 'Маска', },
            { id: 'Essence', translation: 'Аватар', },
        ],
        [
            { id: 'Affiliation', translation: 'Фракция', },
            { id: 'Sect', translation: 'Секта', },
            { id: 'Concept', translation: 'Концепция', },
        ],
    ],
    [CHAR_SECTIONS.ATTRIBUTES]: {
        id: 'Attributes',
        translation: 'Атрибуты',
        sections: [
            {
                id: 'Physical',
                translation: 'Физические',
                values: [
                    { id: 'Strength', translation: 'Сила', },
                    { id: 'Dexterity', translation: 'Ловкость', },
                    { id: 'Stamina', translation: 'Выносливость', },
                ]
            },
            {
                id: 'Social',
                translation: 'Социальные',
                values: [
                    { id: 'Charisma', translation: 'Харизма', },
                    { id: 'Manipulation', translation: 'Манипуляция', },
                    { id: 'Appearance', translation: 'Внешность', },
                ]
            },
            {
                id: 'Mental',
                translation: 'Ментальные',
                values: [
                    { id: 'Perception', translation: 'Восприятие', },
                    { id: 'Intelligence', translation: 'Интеллект', },
                    { id: 'Wits', translation: 'Смекалка', },
                ]
            },
        ],
    },
    [CHAR_SECTIONS.ABILITIES]: {
        id: 'Abilities',
        translation: 'Способности',
        sections: [
            {
                id: 'Talents',
                translation: 'Таланты',
                values: [
                    { id: 'Alertness', translation: 'Внимательность', },
                    { id: 'Art', translation: 'Искусство', },
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
                id: 'Skills',
                translation: 'Навыки',
                values: [
                    { id: 'Crafts', translation: 'Ремесло', },
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
                id: 'Knowledges',
                translation: 'Знания',
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
    [CHAR_SECTIONS.SPHERES]: {
        id: 'Spheres',
        translation: 'Сферы',
        columns: [
            [
                { id: 'Correspondence', translation: 'Связи', },
                { id: 'Entropy', translation: 'Энтропия', },
                { id: 'Forces', translation: 'Силы', },
            ],
            [
                { id: 'Life', translation: 'Жизнь', },
                { id: 'Matter', translation: 'Материя', },
                { id: 'Mind', translation: 'Разум', },
            ],
            [
                { id: 'Prime', translation: 'Основы', },
                { id: 'Spirit', translation: 'Дух', },
                { id: 'Time', translation: 'Время', },
            ],
        ],
    },
    [CHAR_SECTIONS.BACKGROUNDS]: {
        id: 'Backgrounds',
        translation: 'Факты биографии',
        variants: [
            { id: 'Avatar', translation: 'Аватар', },
        ]
    },
    [CHAR_SECTIONS.ARETE]: { id: 'Arete', translation: 'Арете', },
    [CHAR_SECTIONS.WILLPOWER]: { id: 'Willpower', translation: 'Сила воли', },
    [CHAR_SECTIONS.QUINTESSENCE]: { id: 'Quintessence', translation: 'Квинтэссенция', },
    [CHAR_SECTIONS.PARADOX]: { id: 'Paradox', translation: 'Парадокс', },
    [CHAR_SECTIONS.HEALTH]: {
        id: 'Health',
        translation: 'Здоровье',
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
    [CHAR_SECTIONS.EXPERIENCE]: { id: 'Experience', translation: 'Опыт', },
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

export const CHAR_RESULT_TRANSLATIONS = 'Итог';
export const CHAR_SETTINGS_TRANSLATIONS = 'Настройки';

export const CHAR_VALIDATIONS = Object.freeze({
    [CHAR_EDIT_STATES.BASE]: {
        editable: true,
        valueField: CHAR_EDIT_STATES.BASE,
        valueTranslation: CHAR_EDIT_STATES_TRANSLATIONS[CHAR_EDIT_STATES.BASE],
        prev: [],
        next: [CHAR_EDIT_STATES.POINTS, CHAR_EDIT_STATES.EXP],
        [CHAR_SECTIONS.ATTRIBUTES]: {
            sectionPoints: [7, 5, 3],
            specialty: 4,
            min: 1,
            max: 5,
            price: (total, prevTotal) => 1,
        },
        [CHAR_SECTIONS.ABILITIES]: {
            sectionPoints: [13, 9, 5],
            min: 0,
            max: 3,
            price: (total, prevTotal) => 1,
        },
        [CHAR_SECTIONS.SPHERES]: {
            freePoints: 6,
            price: (total, prevTotal) => 1,
        },
        footer: {
            [CHAR_SECTIONS.BACKGROUNDS]: {
                freePoints: 7,
                price: (total, prevTotal) => 1,
            },
            [CHAR_SECTIONS.ARETE]: {
                min: 1,
            },
            [CHAR_SECTIONS.WILLPOWER]: {
                min: 5,
            }
        },
    },
    [CHAR_EDIT_STATES.POINTS]: {
        editable: true,
        valueField: CHAR_EDIT_STATES.POINTS,
        valueTranslation: CHAR_EDIT_STATES_TRANSLATIONS[CHAR_EDIT_STATES.POINTS],
        prev: [CHAR_EDIT_STATES.BASE],
        next: [CHAR_EDIT_STATES.EXP],
        freePoints: 15,
        [CHAR_SECTIONS.ATTRIBUTES]: {
            specialty: 4,
            min: 0,
            price: (total, prevTotal) => 5,
        },
        [CHAR_SECTIONS.ABILITIES]: {
            specialty: 4,
            min: 0,
            price: (total, prevTotal) => 2,
        },
        [CHAR_SECTIONS.SPHERES]: {
            min: 0,
            price: (total, prevTotal) => 7,
        },
        [CHAR_SECTIONS.BACKGROUNDS]: {
            min: 1,
            price: (total, prevTotal) => 1,
        },
        [CHAR_SECTIONS.ARETE]: {
            min: 0,
            totalMax: 3,
            price: (total, prevTotal) => 4,
        },
        [CHAR_SECTIONS.WILLPOWER]: {
            min: 0,
            price: (total, prevTotal) => 1,
        },
    },
    [CHAR_EDIT_STATES.EXP]: {
        editable: true,
        valueField: CHAR_EDIT_STATES.EXP,
        valueTranslation: CHAR_EDIT_STATES_TRANSLATIONS[CHAR_EDIT_STATES.EXP],
        prev: [CHAR_EDIT_STATES.BASE, CHAR_EDIT_STATES.POINTS],
        next: [],
        [CHAR_SECTIONS.ATTRIBUTES]: {
            specialty: 4,
            min: 0,
            price: (total, prevTotal) => total * 4,
        },
        [CHAR_SECTIONS.ABILITIES]: {
            specialty: 4,
            min: 0,
            price: (total, prevTotal) => total == 0 && prevTotal == 0 ? 3 : total * 2,
        },
        [CHAR_SECTIONS.SPHERES]: {
            min: 0,
            price: (total, prevTotal) => total == 0 && prevTotal == 0 ? 10 : total * 8, // Add Affinity/Other Sphere
        },
        [CHAR_SECTIONS.BACKGROUNDS]: {
            min: 1,
            price: (total, prevTotal) => total * 3,
        },
        [CHAR_SECTIONS.ARETE]: {
            min: 0,
            price: (total, prevTotal) => total * 8,
        },
        [CHAR_SECTIONS.WILLPOWER]: {
            min: 0,
            price: (total, prevTotal) => total,
        },
    },
    [CHAR_EDIT_STATES.TOTAL]: {
        editable: false,
        valueField: undefined,
        valueTranslation: CHAR_EDIT_STATES_TRANSLATIONS[CHAR_EDIT_STATES.TOTAL],
        prev: [CHAR_EDIT_STATES.BASE, CHAR_EDIT_STATES.POINTS, CHAR_EDIT_STATES.EXP],
        next: [],
        [CHAR_SECTIONS.ATTRIBUTES]: {
            totalMin: 1,
            totalMax: 5,
        },
        [CHAR_SECTIONS.ABILITIES]: {
            totalMin: 0,
            totalMax: 5,
        },
        [CHAR_SECTIONS.SPHERES]: {
            totalMin: 0,
            totalMax: 5,
        },
        [CHAR_SECTIONS.BACKGROUNDS]: {
            totalMin: 0,
            totalMax: 5,
        },
        [CHAR_SECTIONS.ARETE]: {
            totalMin: 1,
            totalMax: 10,
        },
        [CHAR_SECTIONS.WILLPOWER]: {
            totalMin: 0,
            totalMax: 10,
        },
    },
});
