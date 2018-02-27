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



    filterByAndGetBody(body: string) {
        let input = element(by.id('todoBody'));
        let submit = element(by.id('submitSearch'));
        input.click();
        input.sendKeys(body);
        submit.click();

        let el = element.all(by.css('.bodyDisplay')).first();
        let container = element.all(by.css('.todos')).first();
        container.click();
        let result = el.getText();
        return result;
    }

    filterByAndGetStatus(status: string) {
        let input = element(by.id('todoStatusAlt'));
        input.click();
        input.sendKeys(status);

        let el = element.all(by.css('.status')).first();
        let container = element.all(by.css('.todos')).first();
        container.click();
        return el.getText();
    }

    filterByAndGetCategory(category: string) {
        let input = element(by.id('todoCategory'));
        input.click();
        input.sendKeys(category);

        let container = element.all(by.css('.todos')).first();
        container.click();
        return container.getText();
    }

    addTodo(owner: string, category: string, body: string) {
        let ownerInput = element(by.id('ownerField'));
        let categoryInput = element(by.id('categoryField'));
        let bodyInput = element(by.id('bodyField'));
        let submit = element(by.id('confirmAddTodoButton'));

        ownerInput.click();
        ownerInput.sendKeys(owner);
        categoryInput.click();
        categoryInput.sendKeys(category);
        bodyInput.click()
        bodyInput.sendKeys(body);

        submit.click();
    }
}
