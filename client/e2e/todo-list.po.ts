import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class TodoPage{
    navigateTo(): promise.Promise<any> {
        return browser.get('/todos');
    }

    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }
        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getTodoTitle() {
        const title = element(by.id('todo-list-title')).getText();
        this.highlightElement(by.id('todo-list-title'));

        return title;
    }

    searchByOwner(owner: string) {
        const input = element(by.id('todoOwner'));
        const submit = element(by.id('submitSearch'));

        input.click();
        input.sendKeys(owner);

        submit.click();
    }

}
