import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  registerMode = false;

  onRegisterToggle() {
    this.registerMode = !this.registerMode;
  }

  onCancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }
}
