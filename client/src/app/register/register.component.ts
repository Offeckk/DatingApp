import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;
 
  constructor(private accountService: AccountService, private toastr: ToastrService,
      private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', [Validators.required, this.hasOnlyDigitsAndLetters()]],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, 
        Validators.minLength(6), Validators.maxLength(16), this.hasUpperCaseAndDigit()]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  hasOnlyDigitsAndLetters(): ValidatorFn {
    return (control: AbstractControl) => {
      const value: string = control.value;
      if (!(value && /^[A-Za-z0-9]*$/.test(value))) {
          return {notOnlyDigitsAndLetters: true};
      } else {
          return null;
      }
    }
  }

  hasUpperCaseAndDigit(): ValidatorFn {
    return (control: AbstractControl) => {
      const value: string = control.value;
      if (!(value && value !== value.toLowerCase() && /[0-9]/.test(value))) {
          return {notUpperCaseAndDigit: true};
      } else {
          return null;
      }
    }
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : 
        { notMatching: true }
    }
  }

  onRegister() {
    const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const values = {...this.registerForm.value, dateOfBirth: dob};
    this.accountService.register(values).subscribe({
      next: () => {
        this.router.navigateByUrl('/members')
      },
      error: error => {
        this.validationErrors = error
      } 
    })
  }

  onCancel() {
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    let theDob = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset()))
      .toISOString().slice(0, 10);
  }
  
}
