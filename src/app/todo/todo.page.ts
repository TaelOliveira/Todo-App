import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {switchMap, map, switchMapTo, shareReplay} from 'rxjs/operators';
import {DbService} from '../services/db.service';
import {ModalController} from '@ionic/angular';
import {TodoFormComponent} from './todo-form/todo-form.component';
import { modalController } from '@ionic/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {
  todos;
  filtered;

  filter = new BehaviorSubject(null);

  constructor(
    public db:DbService,
    public modal:ModalController
  ) { }

  async ngOnInit() {

    this.todos = this.db.collection$('todos', ref =>
    ref
      .orderBy('createAt', 'desc')
    );
  }

  updateFilter(val){
    this.filter.next(val);
  }

  trackById(id, todo){
    return todo.id;
  }

  deleteTodo(todo){
    this.db.delete(`todos/${todo.id}`);
    console.log(todo.id);
  }

  toggleStatus(todo){
    const status = todo.status === 'complete' ? 'pending' : 'complete';
    this.db.updateAt(`todos/${todo.id}`, {status});
  }

  async presentTodoForm(todo?: any){
    const modal = await this.modal.create({
      component: TodoFormComponent,
      componentProps: {todo}
    });
    return await modal.present();
  }

}
