import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginReq } from '../interfaces/login-req.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  private router = inject(Router);
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);


  get formsValue(){
    return this.form.controls;
  }

  public form: FormGroup = this.fb.group({
    email: ['',[Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.-]+)@([a-zA-Z0-9_\.-]+)\.([a-zA-Z]{2,5})$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(){
    
  }

  ngOnInit(): void {

  }

  login(){
    const body: LoginReq = {
      email: this.formsValue['email'].value,
      password: this.formsValue['password'].value,
    }
    this.authService.login(body).subscribe({
      next: (response) => {
        // console.log(response);
        this.router.navigate(['/private/dashboard']);
      },
      error: (error) => { console.log (error); },
      complete: () => {

      }
    })
  }


  goto(){
    this.router.navigate(['/public/register']);
  }

  campoNoEsValido (campo: string): any {
    return this.form?.controls[campo]?.errors && (this.form?.controls[campo]?.touched || this.form?.controls[campo]?.errors?.['pattern']?.requiredPattern); 
  }

  gotoForget(){
    this.router.navigate(['/public/forgot-password']);
  }
}
