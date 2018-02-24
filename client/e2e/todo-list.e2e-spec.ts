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
    })


    it('Should type in the Search by Owner field and filter the todos', () =>{
        page.navigateTo();
        page.searchByOwner('Barry');
        expect(element.all(by.className('todos')).first().getText()).toContain('Barry');
    })
});
