import {
  HttpInterceptorFn,
} from '@angular/common/http';


// ==========================
// INTERCEPTOR DE AUTENTICACION
// ==========================

export const authInterceptor: HttpInterceptorFn = (
  request,
  next,
) => {
  // ==========================
  // OBTENER TOKEN
  // ==========================

  const token =
    localStorage.getItem('accessToken');


  // ==========================
  // PETICION SIN TOKEN
  // ==========================

  if (!token) {
    return next(request);
  }


  // ==========================
  // AGREGAR TOKEN
  // ==========================

  const authenticatedRequest =
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });


  // ==========================
  // CONTINUAR PETICION
  // ==========================

  return next(authenticatedRequest);
};
