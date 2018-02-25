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
        expect(page.filterByAndGetStatusComplete()).toContain('true');
    });
    */

    it('Should type in the Filter by Category field and filter the todos by category',() =>{
        page.navigateTo();
        expect(page.filterByAndGetCategory('video games')).toContain('video games');
    });


    it('Should open a dialouge box to create a new user', () =>{
        page.navigateTo();
        element(by.id('addNewTodo')).click();
        expect(element(by.id('addTodoTitle')).getText()).toContain('New Todo');
    });

    it('Should type in the information of a todo and add it',() =>{
        page.navigateTo();
        element(by.id('addNewTodo')).click();
        page.addTodo('Eric', 'homework', 'this is only a test');
        expect(page.filterByAndGetBody('this is only a test')).toContain('this is only a test');
    });


});
