import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoListComponent} from './todo-list.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Todo list', () =>{

    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() =>{
        todoListServiceStub = {
            getTodos: () => Observable.of([
                {
                    _id: 'eric_id',
                    owner: 'Eric',
                    status: true,
                    body: 'hello world',
                    category: 'video games'
                },
                {
                    _id: 'paul_id',
                    owner: 'Paul',
                    status: false,
                    body: 'hello space',
                    category: 'homework'
                },
                {
                    _id: 'greg_id',
                    owner: 'Greg',
                    status: true,
                    body: 'goodbye world',
                    category: 'domination'
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [TodoListComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() =>{
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the todos', () => {
        expect(todoList.todos.length).toBe(3);
    });

    it('contains a todo owned by \'Greg\'', () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Greg')).toBe(true);
    });

    it('contain a user named \'Paul\'', () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Paul')).toBe(true);
    });

    it('doesn\'t contain a user named \'Santa\'', () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Santa')).toBe(false);
    });

    it('has two todos that are complete', () => {
        expect(todoList.todos.filter((todo: Todo) => todo.status === true).length).toBe(2);
    });

    it('user list filters by status', () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoStatus = 'false';
        todoList.refreshTodos().subscribe(() => {
            expect(todoList.filteredTodos.length).toBe(1);
        })
    })
})
