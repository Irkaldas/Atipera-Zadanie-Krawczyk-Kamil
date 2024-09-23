import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableElementComponent } from './element-table/table-element/table-element.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TableElementComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Atipera-Zadanie-Krawczyk-Kamil';
}
