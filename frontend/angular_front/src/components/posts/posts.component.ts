import {Component, Inject} from '@angular/core';
import {PostsService} from '../../services/posts/posts.service';
import {Post} from '../../interfaces/posts';
import {AsyncPipe, NgForOf} from '@angular/common';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-posts',
  imports: [
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent {
  posts$: Observable<Post[]>;
  constructor(postService: PostsService) {
    this.posts$ = postService.getPosts();
  }
}
