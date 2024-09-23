import { Injectable } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { ELEMENT_DATA } from '../mock-data/table-elements-mock-data';
import { PeriodicElement } from '../models/periodic-element.model';

@Injectable()
export class TableService {
  public readonly state = rxState<{ periodicElements: PeriodicElement[] }>(
    ({ set }) => set({ periodicElements: ELEMENT_DATA })
  );
}
