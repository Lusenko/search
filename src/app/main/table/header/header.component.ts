import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TableHeader} from "../../../../interface/table-header";
import {Posts} from "../../../../interface/posts";
import {SortState} from "../../../../enum/sort-state";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() sortedState = SortState.default;
  @Input() title = '';
  @Output() headState = new EventEmitter<TableHeader>();

  state = SortState;

  constructor() { }

  emitSortedState(head: string): void {
    if (this.sortedState === SortState.default) {
      this.sortedState = SortState.up;
    } else {
      this.sortedState = this.sortedState === SortState.up ? SortState.down : SortState.default;
    }

    this.headState?.emit({head: head as keyof Posts , sorted_state: this.sortedState});
  }
}
