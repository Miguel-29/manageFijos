import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor {
  constructor() {}  
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';                

        if (error.error instanceof HttpErrorResponse) {
          // Error del cliente
          errorMsg = `Error de petición, Error: ${error.error.message}`;
        } else {
          // Error del servidor
          errorMsg = `Error de servidor, Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        // this.openSnackBar(errorMsg, 'Entendido');
        // console.error("hola", errorMsg);
        // Aquí podrías mostrar un toast o snackbar global
        return throwError(() => {new Error(error.message || 'Server error')});
      })
    );
  }

  
}
