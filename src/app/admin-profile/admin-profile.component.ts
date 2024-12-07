import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent {
  // Dummy admin profile data
  currentAdmin = {
    AdminID: 1,
    Username: 'admin1',
    Email: 'admin1@example.com'
  };
}
