import {Component} from '@angular/core';
import {RouterLink,} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {NgIf} from '@angular/common';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-nav-bar',
  imports: [
    RouterLink,
    NgIf,
    MatToolbar,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent{
  constructor(protected authService: AuthService) {}

}
