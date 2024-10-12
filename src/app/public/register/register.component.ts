import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '../interfaces/register.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  get formsValue() {
    return this.form.controls;
  }

  public form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.-]+)@([a-zA-Z0-9_\.-]+)\.([a-zA-Z]{2,5})$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required, Validators.minLength(6)]],
  }, {
    validators: [
      this.isFieldOneEqualToFieldTwo('password', 'password2')
    ]
  });

  goto() {
    this.router.navigate(['/public/login']);
  }

  register() {
    const body: RegisterRequest = {
      name: this.formsValue['name'].value,
      email: this.formsValue['email'].value,
      password: this.formsValue['password'].value,
    };

    this.authService.register(body).subscribe({
      next: (response) => {
        this.router.navigate(['/private/dashboard']);
      },
      error: (error) => { console.log(error); },
      complete: () => {

      }
    });

  }

  isFieldOneEqualToFieldTwo(field1: string, field2: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const formGroupTyped = formGroup as FormGroup;
      const pass1 = formGroupTyped.controls[field1].value;
      const pass2 = formGroupTyped.controls[field2].value;

      if (pass1 !== pass2) {
        formGroupTyped.controls[field2].setErrors({ noIguales: true });
        return { noIguales: true };
      }

      formGroupTyped.controls[field2].setErrors(null);
      return null;
    };
  }

  
  isValidField(field: string) {
    return this.authService.isValidField(field, this.form);
  }


}
