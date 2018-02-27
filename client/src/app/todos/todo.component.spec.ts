import {ComponentFixture, TestBed, async} from '@angular/core/testing'
import {Todo} from './todo';
import {TodoComponent} from "./todo.component";
import {TodoListService} from "./todo-list.service";
import {Observable} from "rxjs/Observable";

describe('Todo component', () =>{
    let todoComponent: TodoComponent
    let fixture: ComponentFixture<TodoComponent>;

    let todoListServiceStub: {
        getTodoById: (todoID: string) => Observable<Todo>
    };

    beforeEach(() =>{
        todoListServiceStub = {
            getTodoById: (todoID: string) => Observable.of([
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
            ].find(todo => todo._id === todoID))
        };

        TestBed.configureTestingModule({
            declarations: [TodoComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        });
    });

    beforeEach(async(() =>{
        TestBed.compileComponents().then(() =>{
            fixture = TestBed.createComponent(TodoComponent);
            todoComponent = fixture.componentInstance;
        });
    }));

    it('can retrieve Erics todo by ID', () =>{
        todoComponent.setId('eric_id');
        expect(todoComponent.todo).toBeDefined();
        expect(todoComponent.todo.owner).toBe('Eric');
        expect(todoComponent.todo.category).toBe('video games');
    });

    it('returns undefined for Santa', () =>{
        todoComponent.setId('Santa');
        expect(todoComponent.todo).not.toBeDefined;
    });
    
})
