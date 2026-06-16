import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
export interface FormResponse<T = any> { data: T; }
@Injectable({
  providedIn: 'root',
})
export class Form {
    private http = inject(HttpClient);
    private readonly BASE_URL = 'https://benepik.in/channelLoyality';
    private readonly checksum = 'U2FsdGVkX19852iGboQOh92JyErx7FvSEr9qoMXavAXhehEA0h8omB6jLco+GEoYmAGLt2+P+EW8sYnpye7GtVKybxoe4RkRxQCeA/JhQ/zArs9299b3QKgZ0EEnAMexX0J9TLx3m0mE9SbvmSSzRjkGBAqlJk5u2A6kabXUQ/k=';
  
  
  
    getFormData() {
    return this.http.post<FormResponse>(
      `${this.BASE_URL}/getFormDataByUserType`,
      {
        checksum: this.checksum
      }
    );
  }

  }
