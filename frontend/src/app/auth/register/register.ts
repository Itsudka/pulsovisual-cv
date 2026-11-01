import {
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import {
  Router,
  RouterLink,
} from '@angular/router';

import { AuthService } from '../auth.service';


// ==========================
// VALIDADOR DE CONTRASEÑAS
// ==========================

function passwordsMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const password =
    control.get('password')?.value;

  const confirmPassword =
    control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword
    ? null
    : {
        passwordsMismatch: true,
      };
}


@Component({
  selector: 'app-register',

  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],

  templateUrl: './register.html',

  styleUrl: './register.css',
})
export class Register {

  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);


  // ==========================
  // ESTADO
  // ==========================

  readonly isLoading =
    signal(false);

  readonly errorMessage =
    signal<string | null>(null);


  // ==========================
  // FORMULARIO
  // ==========================

  readonly registerForm =
    this.formBuilder.nonNullable.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
          ],
        ],

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
            Validators.minLength(6),
          ],
        ],

        confirmPassword: [
          '',
          [
            Validators.required,
          ],
        ],
      },

      {
        validators:
          passwordsMatchValidator,
      },
    );


  // ==========================
  // REGISTRO
  // ==========================

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const {
      name,
      email,
      password,
    } =
      this.registerForm.getRawValue();

    this.authService
      .register({
        name,
        email,
        password,
      })
      .subscribe({
        next: () => {
          this.router.navigate(
            [
              '/login',
            ],
            {
              state: {
                registrationSuccess: true,
              },
            },
          );
        },

        error: (error) => {
          if (error.status === 409) {
            this.errorMessage.set(
              'Ya existe una cuenta registrada con este correo.',
            );

            return;
          }

          this.errorMessage.set(
            'No fue posible crear la cuenta. Intenta nuevamente.',
          );
        },

        complete: () => {
          this.isLoading.set(false);
        },
      });
  }
}
