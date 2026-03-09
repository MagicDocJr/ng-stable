import { CurrencyPipe, DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { UserService } from '../../betting/services/user.service';

@Component({
  selector: 'app-profile-modal',
  imports: [CurrencyPipe, DatePipe, DecimalPipe, UpperCasePipe],
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.css'],
})
export class ProfileModalComponent {
  userService = inject(UserService);

  closeModal = output<void>();
  close() {
    this.closeModal.emit();
  }

  deposit(amountStr: string): void {
    const amount = Number(amountStr);
    if (!isNaN(amount)) {
      this.userService.updateBalance(amount);
    }
  }
}
