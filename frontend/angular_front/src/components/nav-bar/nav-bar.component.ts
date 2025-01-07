import {Component} from '@angular/core';
import {RouterLink,} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {NgIf} from '@angular/common';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-nav-bar',
  imports: [
    RouterLink,
    NgIf,
    MatToolbar,
    MatIcon,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent{
  constructor(protected authService: AuthService) {}

}
