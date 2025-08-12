import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';

  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$')
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    }, { validators: this.passwordMatchValidator.bind(this) });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    console.log('Validation:', { password, confirmPassword, mismatch: password !== confirmPassword });
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    console.log('Form valid:', this.registerForm.valid, this.registerForm.value);
    if (this.registerForm.valid) {
      const { username, password } = this.registerForm.value;
      this.authService.register(username, password).subscribe({
        next: (response) => {
          console.log('Register success:', response);
          this.router.navigate(['/login']).then(success => {
            console.log('Navigation to login success:', success);
            this.dialogRef.close();
          }).catch(err => console.error('Navigation to login error:', err));
        },
        error: (err) => {
          console.error('Register error:', err);
          this.error = err.error?.message || 'Registration failed. Please try again.';
          // Optionally reset form or focus on username if duplicate
          this.registerForm.get('username')?.setValue('');
        },
        complete: () => console.log('Register subscription complete')
      });
    } else {
      this.error = 'Please fix the form errors before submitting.';
      this.registerForm.markAllAsTouched();
    }
  }

  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}