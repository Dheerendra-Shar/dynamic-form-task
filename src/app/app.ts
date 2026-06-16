import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Form } from './form';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
interface FormResponse<T = any> {
  data: T;
}
@Component({
  selector: 'app-root',
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App implements OnInit {
  protected readonly title = signal('dynamic-form-task');
  private formService = inject(Form);
  private fb = inject(FormBuilder);
dynamicForm: FormGroup = new FormGroup({});
  sections: any[] = [];
originalResponse: any[] = [];
  ngOnInit() {
    this.getFormDetails();
  }

getFormDetails() {
    console.log('API calling...');
  this.formService.getFormData()
    .subscribe({
      next: (res: FormResponse<any>) => {
        this.sections = res.data;
        this.originalResponse = structuredClone(res.data);
        console.log('this.sections: ', this.sections);
        this.createForm();
      },
      error: (err) => {
        console.error('Error =>', err);
      }
    });
}

createForm() {
    console.log('createForm called');

  const controls: any = {};

  this.sections.forEach(section => {

    section.fields.forEach((field: any) => {

      const validators = [];

      const rules = field.validationRules;

      if (rules?.required?.value) {
        validators.push(Validators.required);
      }

      if (rules?.pattern?.value) {
        validators.push(
          Validators.pattern(rules.pattern.value)
        );
      }

      if (rules?.maxLength?.value) {
        validators.push(
          Validators.maxLength(rules.maxLength.value)
        );
      }

      controls[field.saveColumnName] =
        new FormControl(field.fieldValue || '', validators);

    });

  });

  this.dynamicForm = this.fb.group(controls);

  console.log(this.dynamicForm);
}

getErrorMessage(field: any): string {

  const control =
    this.dynamicForm.get(field.saveColumnName);

  if (!control?.errors) return '';

  if (control.errors['required']) {
    return field.validationRules?.required?.message;
  }

  if (control.errors['pattern']) {
    return field.validationRules?.pattern?.message;
  }

  if (control.errors['maxlength']) {
    return field.validationRules?.maxLength?.message;
  }

  return 'Invalid Field';
}


filePreviews: Record<string, string> = {};

onFileSelected(event: Event, controlName: string) {

  const input = event.target as HTMLInputElement;

  if (!input.files?.length) return;

  const file = input.files[0];

  // Preview
  this.filePreviews[controlName] = URL.createObjectURL(file);

  // Base64
  const reader = new FileReader();

  reader.onload = () => {

    const base64 = reader.result as string;

    this.dynamicForm.patchValue({
      [controlName]: base64
    });

  };

  reader.readAsDataURL(file);
}

submitForm() {

  if (this.dynamicForm.invalid) {
    this.dynamicForm.markAllAsTouched();
    return;
  }

  const payload = structuredClone(this.sections);

  payload.forEach((section: any) => {

    section.fields.forEach((field: any) => {

      field.fieldValue =
        this.dynamicForm.get(field.saveColumnName)?.value;

    });

  });

  console.log(payload);

 

}
  
}
