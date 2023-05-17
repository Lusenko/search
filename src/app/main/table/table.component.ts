import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil, tap} from "rxjs";
import {Post} from "../../interface/post";
import {TableHeader} from "../../interface/table-header";
import {SortState} from "../../enum/sort-state";
import {SortService} from "../../service/sort.service";
import {SliceListService} from "../../service/slice-list.service";
import {PostsService} from "../../service/posts.service";
import {Slice} from "../../interface/slice";

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
  displayedPosts: Post[] = [];

  private unsubscribe$ = new Subject<void>();
  constructor(
    private readonly sortService: SortService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly postsService: PostsService) { }

  ngOnInit(): void {
    this.postsService.getList$().pipe(
      tap(value => {
        const header = this.sortState ?? SortState.default;

        this.posts = value;

        this.displayedPosts = this.sortService.sortTable(header, value);

        this.changeDetectorRef.markForCheck();
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()
  }

  sliceList(slice: Slice): void {
    this.displayedPosts = this.posts.slice(slice.begin, slice.end);

    const header = this.sortState ?? SortState.default;

    this.displayedPosts = this.sortService.sortTable(header, this.displayedPosts);

    this.changeDetectorRef.markForCheck();
  }

  sort(header: TableHeader<Post>): void {
    this.headerList = this.headerList.map(val => {
      if(val.head !== header.head) {
        return {...val, sortedState: SortState.default};
      }

      return {...val, sortedState: header.sortedState};
    })

    this.sortState = header;

    this.sortService.sortTable(header, this.displayedPosts);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
