
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  signal,
  ViewChild,
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

import { finalize } from 'rxjs';
import { AuthService } from '../auth.service';

// ==========================
// TIPOS DE CLOUDFLARE
// ==========================

interface TurnstileApi {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback'?: () => void;
      'timeout-callback'?: () => void;
      'error-callback'?: (code: string) => void;
    },
  ): string | undefined;

  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

function getTurnstile(): TurnstileApi | undefined {
  return (
    window as Window & { turnstile?: TurnstileApi }
  ).turnstile;
}

// ==========================
// CARGAR CLOUDFLARE
// ==========================

let scriptPromise: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (getTurnstile()) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

    script.async = true;

    script.onload = () => {
      if (getTurnstile()) {
        resolve();
      } else {
        scriptPromise = null;
        reject(new Error('Turnstile no disponible'));
      }
    };

    script.onerror = () => {
      script.remove();
      scriptPromise = null;
      reject(new Error('Error cargando Turnstile'));
    };

    document.head.appendChild(script);
  });

  return scriptPromise;
}

// ==========================
// VALIDADOR DE CONTRASEÑAS
// ==========================

function passwordsMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.get('password')?.value;

  const confirmPassword =
    control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword
    ? null
    : { passwordsMismatch: true };
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
export class Register implements AfterViewInit, OnDestroy {

  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);

  // ==========================
  // CLOUDFLARE
  // ==========================

  @ViewChild('turnstileContainer')
  private turnstileContainer!: ElementRef<HTMLDivElement>;

  // Utiliza la misma Site Key del login
  private readonly siteKey = '0x4AAAAAAF0DwvrUL7TefN9e';

  private widgetId?: string;
  private destroyed = false;

  readonly turnstileToken = signal<string | null>(null);

  // ==========================
  // ESTADO
  // ==========================

  readonly isLoading = signal(false);

  readonly errorMessage = signal<string | null>(null);

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
            Validators.minLength(9),
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
        validators: passwordsMatchValidator,
      },
    );

  // ==========================
  // INICIALIZAR CAPTCHA
  // ==========================

  ngAfterViewInit(): void {
    void loadTurnstile()
      .then(() => {
        if (this.destroyed) return;

        const turnstile = getTurnstile();

        if (!turnstile) {
          throw new Error('Turnstile no disponible');
        }

        this.widgetId = turnstile.render(
          this.turnstileContainer.nativeElement,
          {
            sitekey: this.siteKey,

            callback: (token: string) => {
              this.ngZone.run(() => {
                this.turnstileToken.set(token);
                this.errorMessage.set(null);
              });
            },

            'expired-callback': () => {
              this.ngZone.run(() => {
                this.turnstileToken.set(null);
                this.errorMessage.set(
                  'La verificación expiró. Complétala nuevamente.',
                );
              });
            },

            'timeout-callback': () => {
              this.ngZone.run(() => {
                this.turnstileToken.set(null);
                this.errorMessage.set(
                  'La verificación agotó el tiempo disponible.',
                );
              });
            },

            'error-callback': (code: string) => {
              console.error('Error Turnstile:', code);

              this.ngZone.run(() => {
                this.turnstileToken.set(null);
                this.errorMessage.set(
                  'No fue posible completar la verificación de seguridad.',
                );
              });
            },
          },
        );

        if (!this.widgetId) {
          throw new Error('No se pudo crear el CAPTCHA');
        }
      })
      .catch(() => {
        if (!this.destroyed) {
          this.errorMessage.set(
            'No fue posible cargar la verificación de seguridad.',
          );
        }
      });
  }

  // ==========================
  // REINICIAR CAPTCHA
  // ==========================

  private resetCaptcha(): void {
    this.turnstileToken.set(null);

    if (this.widgetId) {
      getTurnstile()?.reset(this.widgetId);
    }
  }

  // ==========================
  // REGISTRO
  // ==========================

  register(): void {
    if (this.isLoading()) return;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const token = this.turnstileToken();

    if (!token) {
      this.errorMessage.set(
        'Completa la verificación de seguridad.',
      );
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const {
      name,
      email,
      password,
    } = this.registerForm.getRawValue();

    this.authService
      .register({
        name,
        email,
        password,
        turnstileToken: token,
      })
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(
            ['/login'],
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
          } else {
            this.errorMessage.set(
              'No fue posible crear la cuenta. Intenta nuevamente.',
            );
          }

          this.resetCaptcha();
        },
      });
  }

  // ==========================
  // LIMPIEZA
  // ==========================

  ngOnDestroy(): void {
    this.destroyed = true;

    if (this.widgetId) {
      getTurnstile()?.remove(this.widgetId);
    }
  }
}
