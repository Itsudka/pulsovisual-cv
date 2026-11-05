
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
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

// ==========================
// TIPOS DE CLOUDFlARE
// ==========================

interface TurnstileApi {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
    },
  ): string | undefined;

  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// Evita cargar el script varias veces
let turnstileScriptPromise: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) {
    return Promise.resolve();
  }

  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

    script.async = true;

    script.onload = () => {
      if (window.turnstile) {
        resolve();
      } else {
        turnstileScriptPromise = null;
        reject(new Error('Turnstile no disponible'));
      }
    };

    script.onerror = () => {
      script.remove();
      turnstileScriptPromise = null;
      reject(new Error('Error cargando Turnstile'));
    };

    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements AfterViewInit, OnDestroy {

  // ==========================
  // DEPENDENCIAS
  // ==========================

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);

  // ==========================
  // CLOUDFlARE
  // ==========================

  @ViewChild('turnstileContainer')
  private turnstileContainer!: ElementRef<HTMLDivElement>;

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
  // INICIALIZAR CAPTCHA
  // ==========================

  ngAfterViewInit(): void {
    void loadTurnstile()
      .then(() => {
        if (this.destroyed) return;

        this.widgetId = window.turnstile?.render(
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
              });
            },
          },
        );

        if (!this.widgetId) {
          this.errorMessage.set(
            'No se pudo inicializar el CAPTCHA.',
          );
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
      window.turnstile?.reset(this.widgetId);
    }
  }

  // ==========================
  // LOGIN
  // ==========================

  login(): void {
    if (this.isLoading()) return;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
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

    this.authService
      .login({
        ...this.loginForm.getRawValue(),
        turnstileToken: token,
      })
      .subscribe({
        next: (response) => {
          this.authService.saveSession(response);

          this.router.navigate(['/dashboard']);
        },

        error: () => {
          this.errorMessage.set(
            'No fue posible iniciar sesión. Verifica tus datos e inténtalo nuevamente.',
          );

          this.resetCaptcha();
          this.isLoading.set(false);
        },

        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  // ==========================
  // LIMPIEZA
  // ==========================

  ngOnDestroy(): void {
    this.destroyed = true;

    if (this.widgetId) {
      window.turnstile?.remove(this.widgetId);
    }
  }
}
