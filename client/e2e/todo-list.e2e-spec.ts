import {TodoPage} from './todo-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

describe('Todo List', () => {
    let page: TodoPage;

    beforeEach(()=>{
        page = new TodoPage;
    });

    it('Should get and highlight the Todos title attribute ', () =>{
        page.navigateTo();
        expect(page.getTodoTitle()).toEqual('Todos');
    });


    it('Should type in the Search by Owner field and filter the todos by body', () =>{
        page.navigateTo();
        page.searchByOwner('Barry');
        expect(element.all(by.className('todos')).first().getText()).toContain('Barry');
    });

    it('Should type in the Search by Body and filter the todos by body', () =>{
        page.navigateTo();
        expect(page.filterByAndGetBody('commodo')).toContain('commodo');
    });

    /*
    it('Should select Complete for Status and filter the todos by completion status', () =>{
        page.navigateTo();
        page.searchByStatusComplete;
        expect(page.getStatus("true") === true);
    })
    */
});
