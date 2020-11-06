import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'sample';
  value = 'dynamic value';
  displayTitle = true;

  user = { name: of('han solo') } as User;
}

interface User {
  name: Observable<string>;
}
