export const charConfig = Object.freeze({
    states: {
        title: 'Attributes',
        translation: 'Атрибуты',
        sections: [
            {
                title: 'Physical',
                translation: 'Физические',
                values: [
                    { title: 'Strength', translation: 'Сила', },
                    { title: 'Dexterity', translation: 'Ловкость', },
                    { title: 'Stamina', translation: 'Выносливость', },
                ]
            },
            {
                title: 'Social',
                translation: 'Социальные',
                values: [
                    { title: 'Charisma', translation: 'Харизма', },
                    { title: 'Manipulation', translation: 'Манипуляция', },
                    { title: 'Appearance', translation: 'Внешность', },
                ]
            },
            {
                title: 'Mental',
                translation: 'Ментальные',
                values: [
                    { title: 'Perception', translation: 'Восприятие', },
                    { title: 'Intelligence', translation: 'Интеллект', },
                    { title: 'Wits', translation: 'Смекалка', },
                ]
            },
        ],
    },
});