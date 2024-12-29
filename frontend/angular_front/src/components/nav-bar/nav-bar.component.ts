import {Component, OnInit} from '@angular/core';
import {RouterLink,} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  imports: [
    RouterLink,
    NgIf,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{

  constructor(private authService: AuthService) {}
  protected isLogged: boolean | undefined;

  ngOnInit(){
    this.authService.isLogged.subscribe(logged => {
      this.isLogged = logged;
    });
  }

}
