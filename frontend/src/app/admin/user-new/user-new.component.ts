import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';

import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user.model';
import { AlertService } from '../../services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styles: [],
})
export class UserNewComponent implements OnInit {
  rf: FormGroup;
  validRoles: string[];
  user: UserModel;
  pageData: { title: string; text: string };

  isEditForm: boolean;

  constructor(
    private fb: FormBuilder,
    private userSv: UserService,
    private alertSv: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.user = UserModel.getInstance({});
    this.checkPage();
    this.validRoles = ['USER_ROLE', 'ADMIN_ROLE'];
    this.createForm();
    this.loadFormData();
  }

  ngOnInit(): void {}

  checkPage(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.pageData = {
        title: 'EDICION DE USUARIOS',
        text: 'Edita los campos que quieras cambiar.',
      };

      this.userSv.get(id).subscribe(
        (res) => {
          this.user = UserModel.getInstance(res);
          this.isEditForm = true;
          this.loadFormData();
          // console.log(res);
        },
        (err) => {
          // console.log(err.error.msg);
          this.alertSv.showError(err.error.msg).then(() => {
            this.router.navigate(['/dashboard']);
          });
        }
      );
    } else {
      this.user = UserModel.getInstance({});
      this.isEditForm = false;
      this.pageData = {
        title: 'REGISTRO DE USUARIOS',
        text: 'Ingrese los campos para agregar un nuevo usuario',
      };
    }
  }

  submit(): void {
    if (this.rf.invalid) {
      Object.values(this.rf.controls).forEach((control) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(
            (ctrl) => ctrl.markAllAsTouched
          );
        } else {
          control.markAsTouched();
        }
      });
      return;
    }

    this.alertSv.loading();
    const formData = this.rf.value;

    this.user.edit(formData);

    const request = this.isEditForm
      ? this.userSv.update(this.user)
      : this.userSv.register(this.user);

    request.subscribe(
      (res) => {
        this.alertSv
          .showSuccess(this.user, 'Usuario registrado correctamente')
          .then(() => {
            this.router.navigate(['/dashboard']);
          });
      },
      (err) => {
        const msg = err.error.msg;
        this.alertSv.showError(msg);
      }
    );
  }

  fileChange(evt: Event): void {
    const img = (evt.target as HTMLInputElement).files[0];
    this.userSv.uploadImage(img, this.user).subscribe(
      (res) => (this.user = res),
      (err) => {
        console.log(err);
      }
    );
  }

  createForm(): void {
    this.rf = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]],
      lastname: ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$'),
        ],
      ],
      password: ['', Validators.required],

      role: [''],
      status: [''],
    });
  }

  loadFormData(): void {
    if (this.isEditForm) {
      this.rf.reset({
        name: this.user.name,
        lastname: this.user.lastname,
        email: this.user.email,
        status: this.user.status,
        role: this.user.role,
      });
      this.email.disable();
      this.password.disable();
    } else {
      this.rf.reset({
        status: true,
        role: this.validRoles[0],
      });
    }
  }

  get name(): AbstractControl {
    return this.rf.get('name');
  }

  get lastname(): AbstractControl {
    return this.rf.get('lastname');
  }

  get email(): AbstractControl {
    return this.rf.get('email');
  }

  get password(): AbstractControl {
    return this.rf.get('password');
  }

  get role(): AbstractControl {
    return this.rf.get('role');
  }

  get status(): AbstractControl {
    return this.rf.get('status');
  }
}
