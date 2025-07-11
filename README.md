```
 _       __      ____  ________               _____ __              __ 
| |     / /___  / __ \/ ____/ /_  ____ ______/ ___// /_  ___  ___  / /_
| | /| / / __ \/ / / / /   / __ \/ __ `/ ___/\__ \/ __ \/ _ \/ _ \/ __/
| |/ |/ / /_/ / /_/ / /___/ / / / /_/ / /   ___/ / / / /  __/  __/ /_  
|__/|__/\____/_____/\____/_/ /_/\__,_/_/   /____/_/ /_/\___/\___/\__/  v0.10
```

# WoDCharSheet

***WoDCharSheet*** - это набор HTML-страниц, предназначенных для упрощения и автоматизации создания персонажей для систем Мира Тьмы (World of Darkness).

На текущий момент поддерживаются следующие системы:
- Mage: The Ascension 20th Anniversary Edition

# Технологии

- Основа проекта - `HTML` + `JavaScript`
- Сборка проекта - `Webpack 5`
- ASCII-шрифт в заголовке данного файла - `Slant`

# Сборка проекта

Для сборки проекта должен быть установлен `Node.js` (во время разработки использовалась версия 18.12.1)

Для инициализации проекта требуется выполнить в терминале команду `npm install`.

Для дальнейшей работы требуется выполнить **одну** из перечисленных команд:
- `npm run dev` - соберет проект и запустит локальный web-сервер с возможностью горячей перезагрузки (удобно для отладки и модификации)
- `npm run prod` - соберет проект в директорию `./dist` (код останется читабельным, но займет больше места)
- `npm run prod-min` - соберет проект в директорию `./dist` и минимизирует код (займет меньше места, но прочитать код будет трудно)