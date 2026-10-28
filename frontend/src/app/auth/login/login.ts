import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly formBuilder = inject(FormBuilder);

  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);


  // ==========================
  // ESTADO
  // ==========================

  readonly isLoading = signal(false);

  readonly errorMessage = signal<string | null>(null);


  // ==========================
  // FORMULARIO
  // ==========================

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
      ],
    ],

    password: [
      '',
      [
        Validators.required,
      ],
    ],
  });


  // ==========================
  // LOGIN
  // ==========================

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService
      .login(
        this.loginForm.getRawValue(),
      )
      .subscribe({
        next: (response) => {
          this.authService.saveSession(
            response,
          );

          this.router.navigate([
            '/dashboard',
          ]);
        },

        error: () => {
          this.errorMessage.set(
            'Correo o contraseña incorrectos',
          );

          this.isLoading.set(false);
        },

        complete: () => {
          this.isLoading.set(false);
        },
      });
  }
}
