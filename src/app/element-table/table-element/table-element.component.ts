import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import {
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  Subject,
} from 'rxjs';
import { PeriodicElement } from '../models/periodic-element.model';
import { TableService } from '../services/table.service';
import { TableDialogComponent } from '../table-dialog/table-dialog/table-dialog.component';

@Component({
  selector: 'app-table-element',
  standalone: true,
  imports: [
    MatTableModule,
    AsyncPipe,
    RxIf,
    RxLet,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
  providers: [TableService, MatDialog],
  templateUrl: './table-element.component.html',
  styleUrl: './table-element.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableElementComponent {
  @ViewChild('vcr', { read: ViewContainerRef }) vcr!: ViewContainerRef;

  protected displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
  ];

  private readonly filterElements$ = new Subject<string>();

  private readonly periodicElements$ =
    inject(TableService).state.select('periodicElements');

  private readonly search$ = this.filterElements$.pipe(
    distinctUntilChanged(),
    combineLatestWith(this.periodicElements$),
    debounceTime(2000),
    map(([phrase, elements]) =>
      !!phrase ? this.filterElements(phrase, elements) : elements
    )
  );

  protected readonly periodicElementsToShow$ = merge(
    this.periodicElements$,
    this.search$
  );

  private readonly dialog = inject(MatDialog);

  protected onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filterElements$.next(inputValue);
  }

  protected edit(column: string, value: number | string): void {
    this.dialog.open(TableDialogComponent, {
      data: {
        column,
        value,
      },
      hasBackdrop: true,
      viewContainerRef: this.vcr,
    });
  }

  private filterElements(
    phrase: string,
    elements: PeriodicElement[]
  ): PeriodicElement[] {
    const filteredElements: PeriodicElement[] = [];
    const searchPhrase = phrase.toLowerCase();
    elements.forEach((element) => {
      Object.keys(element).forEach((key) => {
        const value = element[key].toString().toLowerCase();
        console.log(value, phrase);
        if (value.includes(searchPhrase)) {
          filteredElements.push(element);
        }
      });
    });
    return filteredElements;
  }
}
