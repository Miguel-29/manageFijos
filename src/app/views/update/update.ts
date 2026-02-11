import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { DialogComp } from '../../components/dialog/dialog';

@Component({
  selector: 'app-update',
  imports: [ReactiveFormsModule, MatInputModule,  ],
  templateUrl: './update.html',
  styleUrl: './update.scss',
})
export class Update {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ["", [Validators.required]]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }
}
