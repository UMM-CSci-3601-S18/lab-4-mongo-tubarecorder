import {Component, OnInit} from '@angular/core';
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";
import {Observable} from "rxjs";
import {MatDialog} from '@angular/material';
import {AddTodoComponent} from './add-todo.component';

@Component({
    selector: 'user-list-component',
    templateUrl: 'todo-list.component.html',
    styleUrls: ['./todo-list.component.css'],
})

export class TodoListComponent implements OnInit {
    //These are public so that tests can reference them (.spec.ts)
    public todos: Todo[];
    public filteredTodos: Todo[];

    public todoCategory : string;
    public todoStatus : string;
    public todoOwner : string = "";
    public todoBody : string = "";
    public todoID : string;
    public isUsingChrome : boolean = false;

    public loadReady: boolean = false;

    //Inject the UserListService into this component.
    //That's what happens in the following constructor.
    //panelOpenState: boolean = false;
    //We can call upon the service for interacting
    //with the server.
    constructor(public todoListService: TodoListService, public dialog: MatDialog) {

    }


    public filterTodos(searchCategory: string, searchStatus: string): Todo[] {

        this.filteredTodos = this.todos;

        // Filter by category
        if (searchCategory != null) {
            searchCategory = searchCategory.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchCategory || todo.category.toLowerCase().indexOf(searchCategory) !== -1;
            });
        }

        // Filter by status
        if (searchStatus != null) {

            this.filteredTodos = this.filteredTodos.filter(todo => {
                if (searchStatus === ""){
                    return true;
                }
                if (todo.status) {
                    return searchStatus === "true";
                } else if (!todo.status) {
                    return searchStatus === "false";
                }
            });
        }

        return this.filteredTodos;
    }

    /**
     * Starts an asynchronous operation to update the users list
     *
     */
    refreshTodos(): Observable<Todo[]> {
        //Get Todos returns an Observable, basically a "promise" that
        //we will get the data from the server.
        //
        //Subscribe waits until the data is fully downloaded, then
        //performs an action on it (the first lambda)

        let todos : Observable<Todo[]> = this.todoListService.getTodos(this.todoOwner, this.todoBody);
        todos.subscribe(
            todos => {
                this.todos = todos;
                this.filterTodos(this.todoCategory, this.todoStatus);
            },
            err => {
                console.log(err);
            });
        return todos;
    }


    loadService(): void {
        this.loadReady = true;
        this.todoListService.getTodos(this.todoOwner, this.todoBody).subscribe(
            todos => {
                console.log("it went through here");
                this.todos = todos;
                this.filteredTodos = this.todos;
            },
            err => {
                console.log(err);
            }
        );
    }

    openDialog(): void {
        const newTodo: Todo = {_id: '', owner: '', status: false, category: '', body: ''};
        const dialogRef = this.dialog.open(AddTodoComponent, {
            width: '500px',
            data: { todo: newTodo }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.todoListService.addNewTodo(result).subscribe(
                result => {
                    // this.highlightedID = result;
                    this.refreshTodos();
                },
                err => {

                    console.log('There was an error adding the todo.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }


    ngOnInit(): void {
        this.refreshTodos();
        this.loadService();
        this.detectChrome();
    }

    detectChrome(): void {
        if(navigator.userAgent.indexOf("Chrome") != -1 )
        {
            alert('Warning, it appears you are using Google Chrome. Some filtering features will be unavailable. Please use FireFox for full functionality.');
            console.log("chrome detected");
            this.isUsingChrome=true;
        }
    }
}
