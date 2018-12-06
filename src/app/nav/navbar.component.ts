import { Component } from '@angular/core';

@Component({
  selector: 'drp-navbar',
  templateUrl: './navbar.component.html',
  styles: [`
    nav { margin-bottom: 20px; }
    li > a.nav-link.active { color: #F97924; }
  `]
})
export class NavbarComponent {
}
