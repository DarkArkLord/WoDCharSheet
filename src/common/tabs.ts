export function configureTabsAndButtons(input: any) {
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