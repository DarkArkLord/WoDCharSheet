export const charConfig = Object.freeze({
    states: {
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
    skills: {
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
    }
});