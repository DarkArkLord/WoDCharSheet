import { DarkHtmlElement, EVENTS } from '../common/domWrapper.js'

export function configureDarkTabsAndButtons(input) {
    const {
        tabs = [],
        activeTabIndex,
        activeStyleClass,
    } = input;

    for (const curTab of tabs) {
        curTab.button.setEventHandler(EVENTS.CLICK, function () {
            for (const tab of tabs) {
                tab.button.removeClass(activeStyleClass);
                tab.content.removeClass(activeStyleClass);
            }

            curTab.button.addClass(activeStyleClass);
            curTab.content.addClass(activeStyleClass);
        });
    }

    tabs?.[activeTabIndex]?.button?.inner?.events?.[EVENTS.CLICK]?.();
}

export function configureTabsAndButtons(input) {
    const {
        tabs,
        activeTabIndex,
        activeStyleClass,
    } = input;

    for (const curTab of tabs) {
        curTab.button.onclick = function () {
            for (const tab of tabs) {
                tab.button.classList.remove(activeStyleClass);
                tab.content.classList.remove(activeStyleClass);
            }

            curTab.button.classList.add(activeStyleClass);
            curTab.content.classList.add(activeStyleClass);
        };
    }

    tabs?.[activeTabIndex]?.button?.click();
}