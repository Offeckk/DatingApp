import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private accountService: AccountService, private toastr: ToastrService) {}

  onRegister() {
    this.accountService.register(this.model).subscribe({
      next: () => {
        this.onCancel();
      },
      error: error => this.toastr.error(error.error)
    });
  }

  onCancel() {
    this.cancelRegister.emit(false);
  }
}
