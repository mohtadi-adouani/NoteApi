import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterLink,} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  imports: [
    RouterLink,
    NgIf,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy{
  constructor(protected authService: AuthService) {}

  ngOnInit(): void {
  }
  ngOnDestroy(){
  }

}
