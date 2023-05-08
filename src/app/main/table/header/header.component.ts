import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {SortState} from "../../../enum/sort-state";
import {TableHeader} from "../../../interface/table-header";
import {Post} from "../../../interface/post";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent<T> {
  @Input() sortedState = SortState.default;
  @Input() head: keyof T;
  @Output() headStateChange = new EventEmitter<TableHeader<T>>();

  get state(): string {
    switch (this.sortedState) {
      case SortState.up:
        return 'up';

      case SortState.down:
        return 'down';

      default:
        return 'default';
    }
  }

  constructor() { }

  changeSortedState(): void {
    if (this.sortedState === SortState.default) {
      this.sortedState = SortState.up;
    } else {
      this.sortedState = this.sortedState === SortState.up ? SortState.down : SortState.default;
    }

    this.headStateChange?.emit({head: this.head, sortedState: this.sortedState});
  }
}
