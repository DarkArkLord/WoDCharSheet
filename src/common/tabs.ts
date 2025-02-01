declare namespace TabsAndButtons {
    type TabData = {
        button: HTMLElement;
        content: HTMLElement;
    };

    type ConfigInput = {
        tabs: Array<TabData>;
        activeTabIndex: number;
        activeStyleClass: string;
    };
}

export function configureTabsAndButtons(input: TabsAndButtons.ConfigInput) {
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