function configureTabsAndButtons(input) {
    const {
        tabs,
        activeTabIndex,
        styles: {
            ACTIVE_BUTTON_CLASS,
            DISPLAY_BLOCK_CLASS,
        },
    } = input;

    for (const curTab of tabs) {
        curTab.button.onclick = function () {
            for (const tab of tabs) {
                tab.button.classList.remove(ACTIVE_BUTTON_CLASS);
                tab.content.classList.remove(DISPLAY_BLOCK_CLASS);
            }

            curTab.button.classList.add(ACTIVE_BUTTON_CLASS);
            curTab.content.classList.add(DISPLAY_BLOCK_CLASS);
        };
    }

    tabs?.[activeTabIndex]?.button?.click();
}