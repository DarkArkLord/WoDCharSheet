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
    attributes: {
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
    abilities: {
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
    spheres: {
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
    footer: {
        backgrounds: {
            id: 'Backgrounds',
            translation: 'Факты биографии',
            variants: [
                { id: 'Avatar', translation: 'Аватар', },
            ]
        },
        arete: { id: 'Arete', translation: 'Арете', },
        willpower: { id: 'Willpower', translation: 'Сила воли', },
        quintessence: { id: 'Quintessence', translation: 'Квинтэссенция', },
        paradox: { id: 'Paradox', translation: 'Парадокс', },
        health: {
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
        experience: { id: 'Experience', translation: 'Опыт', },
    },
    // Add second page and other
    aaaaaaaaa: { id: 'Aaaaaaa', translation: 'Aaaaaaaaa', },
});

export const CHAR_EDIT_STATES = Object.freeze({
    BASE: 'base',
    POINTS: 'points',
    EXP: 'exp',
});

export const CHAR_EDIT_STATES_TRANSLATIONS = Object.freeze({
    [CHAR_EDIT_STATES.BASE]: 'Основа',
    [CHAR_EDIT_STATES.POINTS]: 'Свободные точки',
    [CHAR_EDIT_STATES.EXP]: 'Опыт',
});

export const CHAR_SETTINGS_RESULT = 'Итог';
export const CHAR_SETTINGS_TRANSLATIONS = 'Настройки';

export const CHAR_VALIDATIONS = Object.freeze({
    [CHAR_EDIT_STATES.BASE]: {
        prev: [],
        next: [CHAR_EDIT_STATES.POINTS, CHAR_EDIT_STATES.EXP],
        attributes: {
            sectionPoints: [7, 5, 3],
            specialties: 4,
            min: 1,
            max: 5,
            price: (total, prevTotal) => 1,
        },
        abilities: {
            sectionPoints: [13, 9, 5],
            min: 0,
            max: 3,
            price: (total, prevTotal) => 1,
        },
        spheres: {
            freePoints: 6,
            price: (total, prevTotal) => 1,
        },
        footer: {
            backgrounds: {
                freePoints: 7,
                price: (total, prevTotal) => 1,
            },
            arete: {
                min: 1,
            },
            willpower: {
                min: 5,
            }
        },
    },
    [CHAR_EDIT_STATES.POINTS]: {
        prev: [CHAR_EDIT_STATES.BASE],
        next: [CHAR_EDIT_STATES.EXP],
        freePoints: 15,
        attributes: {
            specialties: 4,
            min: 0,
            price: (total, prevTotal) => 5,
        },
        abilities: {
            specialties: 4,
            min: 0,
            price: (total, prevTotal) => 2,
        },
        spheres: {
            min: 0,
            price: (total, prevTotal) => 7,
        },
        footer: {
            backgrounds: {
                min: 1,
                price: (total, prevTotal) => 1,
            },
            arete: {
                min: 0,
                totalMax: 3,
                price: (total, prevTotal) => 4,
            },
            willpower: {
                min: 0,
                price: (total, prevTotal) => 1,
            }
        },
    },
    [CHAR_EDIT_STATES.EXP]: {
        prev: [CHAR_EDIT_STATES.BASE, CHAR_EDIT_STATES.POINTS],
        next: [],
        attributes: {
            specialties: 4,
            min: 0,
            price: (total, prevTotal) => total * 4,
        },
        abilities: {
            specialties: 4,
            min: 0,
            price: (total, prevTotal) => total == 0 && prevTotal == 0 ? 3 : total * 2,
        },
        spheres: {
            min: 0,
            price: (total, prevTotal) => total == 0 && prevTotal == 0 ? 10 : total * 8, // Add Affinity/Other Sphere
        },
        footer: {
            backgrounds: {
                min: 1,
                price: (total, prevTotal) => total * 3,
            },
            arete: {
                min: 0,
                price: (total, prevTotal) => total * 8,
            },
            willpower: {
                min: 0,
                price: (total, prevTotal) => total,
            }
        },
    },
});


export const CHAR_VALIDATIONS_TOTAL = Object.freeze({
    editable: false,
    prev: [CHAR_EDIT_STATES.BASE, CHAR_EDIT_STATES.POINTS, CHAR_EDIT_STATES.EXP],
    next: [],
    attributes: {
        totalMin: 1,
        totalMax: 5,
    },
    abilities: {
        totalMin: 0,
        totalMax: 5,
    },
    spheres: {
        totalMin: 0,
        totalMax: 5,
    },
    footer: {
        backgrounds: {
            totalMin: 0,
            totalMax: 5,
        },
        arete: {
            totalMin: 1,
            totalMax: 10,
        },
        willpower: {
            totalMin: 0,
            totalMax: 10,
        }
    },
});