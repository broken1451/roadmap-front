import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { TodoListElement } from '../interfaces/todo-list.interface';
import { TodoPatchReq } from '../interfaces/todo-update-todo.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SortPipe } from '../pipes/sort.pipe';
import { SortAlphabeticPipe } from '../pipes/sort-alphabetic.pipe';
import { AuthService } from '../../public/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SortPipe, SortAlphabeticPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  public form: FormGroup = this.fb.group({
    title: [''],
    description: ['']
  })
  public order: string = 'all';
  public orderDescAse: string = 'Descending';

  public orderAscDesc: { [key: string]: string }[] = [
    {
      value: 'Ascending', viewValue: 'Ascending',
    },
    {
      value: 'Descending', viewValue: 'Descending'
    }
  ]

  public orderBy: { [key: string]: string }[] = [
    {
      value: '1', viewValue: 'All',
    },
    {
      value: '2', viewValue: 'Completed'
    },
    {
      value: '3', viewValue: 'Active'
    }
  ];

  public arrayPageLimit: number[] = []
  public numberOfPages: number = 0;
  currentPage: number = 1;

  constructor() { }


  ngOnInit(): void {
    this.getTodos();
  }


  public todoService = inject(TodoService);

  public check: boolean = false;

  toggleClass(item: TodoListElement): void {
    item.completed = !item.completed;
    const body: TodoPatchReq = {
      completed: item.completed
    }
    // this.check = !this.check;
    this.todoService.patchTodo(body, item._id).subscribe()
  }

  public getTodos(page:string = '1') {
    this.todoService.getTodos('10', String(page)).subscribe({
      next: (res) => { 
        console.log (res);
        this.numberOfPages = res.total;
        this.arrayPageLimit  = [...Array(res.total).keys()].map(foo => {
          console.log(foo)
          return foo + 1
        });
        this.arrayPageLimit.pop();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 401) {
          Swal.fire({
            title: 'Error',
            text: `${err.error.message}`,
            icon: 'error',
            confirmButtonText: 'Ok',
            showConfirmButton: false,
            timer: 2000
          }).then((value) => {
            this.router.navigate(['/public/login']);
          });
        }
      }
    })
  }

  public createTodos() {
    const body: TodoPatchReq = {
      title: this.form.get('title')?.value,
      description: this.form.get('description')?.value
    }
    body.description = body.title?.trim().toLowerCase();
    this.todoService.createTodo(body).subscribe({
      next: (res) => {
        console.log(res);
        this.getTodos();
        this.form.reset();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  public deleteTodo(item: TodoListElement) {
    this.todoService.deleteTodo(item._id).subscribe({
      next: (res) => {
        this.getTodos();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  async editTodo(item: TodoListElement) {
    const inputValue = item.title;
    const { value: title } = await Swal.fire({
      title: "Please write your updated task",
      input: "text",
      inputLabel: "Task",
      inputValue,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
        const body: TodoPatchReq = {
          title: value
        }
        this.todoService.patchTodo(body, item._id).subscribe()
        return null
      }
    });
    if (title) {
      await Swal.fire({
        position: "center",
        icon: "success",
        title: `You updated the task with: ${title}`,
        showConfirmButton: false,
        timer: 1500
      });
      this.getTodos();
    }
  }



  changeValueSort(event: Event) {
    this.orderDescAse = '';
    switch ((event.target as HTMLInputElement)?.value) {
      case '1':
        this.order = 'all';
        break;
      case '2':
        this.order = 'completed';
        break;
      case '3':
        this.order = 'active';
        break;
      default:
        this.order = 'all';
        break;
    }
  }

  asencDesec(event: Event) {
    this.order = '';
    switch ((event.target as HTMLInputElement)?.value) {
      case 'Ascending':
        this.orderDescAse = 'Ascending';
        break;
      case 'Descending':
        this.orderDescAse = 'Descending';
        break;
      default:
        this.orderDescAse = 'all';
        break;
    }
  }

  toggle() {
    this.check = !this.check;
    if (this.check) {
      this.orderDescAse = 'Ascending';
    } else {
      this.orderDescAse = 'Descending';
    }
  }

  logout() {
    this.authService.logout();
  }

  gotoPage(page: number) {
    this.numberOfPages = page + 1;
    this.currentPage = page + 1
    this.getTodos(String(this.currentPage))
  }

  nextPage() {
    this.currentPage = this.currentPage + 1;
    this.getTodos(String(this.currentPage))
  }

  prevPage() {
    this.currentPage = this.currentPage - 1;
    this.getTodos(String(this.currentPage))
  }
}


