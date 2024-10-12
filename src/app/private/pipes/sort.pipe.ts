import { Pipe, PipeTransform } from '@angular/core';
import { TodoListElement } from '../interfaces/todo-list.interface';

@Pipe({
  name: 'sortBy',
  standalone: true,
})
export class SortPipe implements PipeTransform {

  transform(todos: TodoListElement[], orderBy: string = 'all') {

    // console.log({todos});
    // console.log({orderBy});
    if (todos) {
      let selected: string | boolean | null = null;
      switch (orderBy) {
        case 'all':
          selected = false; 
          break;
        case 'completed':
          selected = true; 
          break;
        case 'active':
          selected = true; 
          break;
        default:
          return todos;
      }

      const selectedTodoCompleted = todos.filter(todo => todo.completed === selected);
      const otherTodos = todos.filter(todo => todo.completed !== selected);
  
      return [...selectedTodoCompleted, ...otherTodos];
    }
    
    return
  }

}
