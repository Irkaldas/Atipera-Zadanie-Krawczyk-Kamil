import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { rxState } from '@rx-angular/state';
import { PeriodicElement } from '../../models/periodic-element.model';
import { TableService } from '../../services/table.service';
import { RxLet } from '@rx-angular/template/let';
import { map, startWith } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RxIf } from '@rx-angular/template/if';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
interface DialogState {
  column: string;
  value: number | string;
}

@Component({
  selector: 'app-table-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    RxLet,
    MatTableModule,
    AsyncPipe,
    RxIf,
    RxLet,
    CommonModule,
  ],
  templateUrl: './table-dialog.component.html',
  styleUrl: './table-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDialogComponent {
  readonly data = inject<DialogState>(MAT_DIALOG_DATA);

  private readonly tableState$ = inject(TableService).state;

  private readonly dialogState = rxState<DialogState>(({ set }) =>
    set({ ...this.data })
  );
  protected value$ = this.dialogState.select('value');
  protected isInputEmpty$ = this.value$.pipe(
    startWith(true),
    map((value) => !!value)
  );

  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.dialogState.set('value', () => inputValue);
  }

  save(): void {
    this.tableState$.set((state) => ({
      periodicElements: this.changeState(state.periodicElements),
    }));
  }

  private changeState(elements: PeriodicElement[]): PeriodicElement[] {
    const newData = this.dialogState.get();
    const { column, value } = this.data;
    const index = elements.findIndex((element) => element[column] === value);
    const dataToUpdate = elements[index];
    dataToUpdate[column] = newData.value;
    return elements;
  }
}
