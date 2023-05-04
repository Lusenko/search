import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {TableHeader} from "../../../../interface/table-header";
import {SortState} from "../../../../enum/sort-state";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() sortedState = SortState.default;
  @Input() head = '';
  @Output() headStateChange = new EventEmitter<TableHeader>();

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

  changeSortedState(head: string): void {
    if (this.sortedState === SortState.default) {
      this.sortedState = SortState.up;
    } else {
      this.sortedState = this.sortedState === SortState.up ? SortState.down : SortState.default;
    }

    this.headStateChange?.emit({head: head , sortedState: this.sortedState});
  }
}
