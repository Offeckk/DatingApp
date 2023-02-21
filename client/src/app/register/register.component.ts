import { Component, EventEmitter, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private accountService: AccountService) {}

  onRegister() {
    this.accountService.register(this.model).subscribe({
      next: () => {
        this.onCancel();
      },
      error: error => console.log(error)
    });
  }

  onCancel() {
    this.cancelRegister.emit(false);
  }
}
