import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from "rxjs";

import {Todo} from './todo';
import {environment} from "../../environments/environment";


@Injectable()
export class TodoListService {
    readonly baseUrl: string = environment.API_URL + "todos";
    private todoUrl: string = this.baseUrl;
    filtered: boolean = false;

    constructor(private http: HttpClient) {
    }

    getTodos(todoOwner : string, todoBody : string): Observable<Todo[]> {
        this.todoUrl = this.baseUrl;


        if(todoOwner !== "" && todoOwner !== null){
            this.todoUrl = this.todoUrl + "?owner=" + todoOwner;
            this.filtered = true;
        }


        if(todoBody != ""){
            if(this.filtered){
                this.todoUrl = this.todoUrl + "&body=" + todoBody;
            } else {
                this.todoUrl = this.todoUrl + "?body=" + todoBody;
            }
        }

        this.filtered = false;
        return this.http.get<Todo[]>(this.todoUrl);
    }

    getTodoById(id: string): Observable<Todo> {
        return this.http.get<Todo>(this.todoUrl + "/" + id);
    }

}
