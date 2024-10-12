import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  get formsValue() {
    return this.form.controls;
  }

  public form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.-]+)@([a-zA-Z0-9_\.-]+)\.([a-zA-Z]{2,5})$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required, Validators.minLength(6)]],
  }, {
    validators: [
      this.isFieldOneEqualToFieldTwo('password', 'password2')
    ]
  });


  isValidField(field: string) {
    return this.authService.isValidField(field, this.form);
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

  updatePass(){
    const { email, password } = this.form.value;
    this.authService.resetPass(email, password).subscribe({
      next: () => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Contraseña Actualizada",
          showConfirmButton: false,
          timer: 3000
        });
        this.goto();
      },
      error: (error) => {
        Swal.fire('Error', error, 'error');
      }
    });
  }

  goto() {
    this.router.navigate(['/public/login']);
  }


}
