import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil, tap} from "rxjs";
import {Post} from "../../interface/post";
import {TableHeader} from "../../interface/table-header";
import {SortState} from "../../enum/sort-state";
import {SortService} from "../../service/sort.service";
import {SliceListService} from "../../service/slice-list.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit, OnDestroy {



  headerList: TableHeader<Post>[] = [
    { head: 'id', sortedState: SortState.default },
    { head: 'title', sortedState: SortState.default },
    { head: 'body', sortedState: SortState.default }
  ]

  sortState: TableHeader<Post>;

  posts: Post[] = [];

  private unsubscribe$ = new Subject<void>();
  constructor(
    private readonly sortService: SortService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly sliceListService: SliceListService<Post>) { }

  ngOnInit(): void {
    this.sliceListService.postList$
      .pipe(
        tap(value => {
          const header = this.sortState ?? SortState.default;

          this.posts = this.sortService.sortTable(header ,value);

          this.changeDetectorRef.markForCheck();
        }),
        takeUntil(this.unsubscribe$),
      ).subscribe()
  }

  sort(header: TableHeader<Post>): void {
    this.headerList = this.headerList.map(val => {
      if(val.head !== header.head) {
        return {...val, sortedState: SortState.default};
      }

      return {...val, sortedState: header.sortedState};
    })

    this.sortState = header;

    this.sortService.sortTable(header, this.posts);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
