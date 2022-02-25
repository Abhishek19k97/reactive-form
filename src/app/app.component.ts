import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { forbiddenNameValidator } from './shared/user-name.validator';
import { passwordValidator } from './shared/password.validator';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
}) 
export class AppComponent implements OnInit {
  registrationForm!: FormGroup;

  get userName() {
    return this.registrationForm.controls['userName']
  };
  get password() {
    return this.registrationForm.controls['password']
  };
  get confirmPassword() {
    return this.registrationForm.controls['confirmPassword']
  };
  get email() {
    return this.registrationForm.controls['email']
  };
  get alternateEmails() {
    return this.registrationForm.controls['alternateEmails'] as FormArray;
  };
  addAlternateEmail() {
    this.alternateEmails.push(this.fb.control(''))
  };
  constructor(private fb: FormBuilder, private _registrationService: RegistrationService) { }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      userName: ['', [Validators.required, forbiddenNameValidator(/password/)]],
      // array's 0th index is for default values and 1st index is for Validation rules
      email: [''],
      subscribe: [false],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', Validators.required],
      address: this.fb.group({
        state: [''],
        city: [''],
        pinCode: [''],
      }),
      alternateEmails: this.fb.array([])
      //we can initialize the formsArray with any no of controls but here we've started with 0 hence the empty array
    }, { validator: passwordValidator }
      // The 2nd method to the FormGroup method is validator
    ); 

    this.registrationForm.get('subscribe')?.valueChanges.subscribe(checkedValue => {
      const email = this.registrationForm.get('email');
      if (checkedValue) {
        email?.setValidators(Validators.required);
      } else {
        email?.clearValidators();
      }
      email?.updateValueAndValidity(); //To ensure correct status is reflected
    })
  }

  onSubmit() {
    console.log(this.registrationForm.value);
    this._registrationService.register(this.registrationForm.value)
      .subscribe(
        response => console.log('Success', response),
        error => console.log('Error', error)        
      )
  }

  loadAPI() {
    console.log(this.registrationForm.value);
    this.registrationForm.setValue({
      userName: '',
      password: 'test1234',
      confirmPassword: 'test1234',
      address: {
        state: 'Washington',
        city: 'Scranton',
        pinCode: 832108
      }
    })
    this.registrationForm.patchValue({
      userName: '',
      // password: 'test1234',
      // confirmPassword: 'test1234',
      address: {
        state: 'Washington',
        city: 'Scranton',
        pinCode: 832108
      }
    })
  }

  // registrationForm = new FormGroup({
  //   userName: new FormControl('Abhishek'),
  //   password: new FormControl(''),
  //   confirmPassword: new FormControl(''),
  //   address: new FormGroup({
  //     state: new FormControl(''),
  //     city: new FormControl(''),
  //     pinCode: new FormControl('')
  //   })
  // });
}
