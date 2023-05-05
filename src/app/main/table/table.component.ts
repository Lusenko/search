import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil, tap} from "rxjs";
import {Post} from "../../interface/post";
import {TableHeader} from "../../interface/table-header";
import {SortState} from "../../enum/sort-state";
import {PostsService} from "../../service/posts.service";
import {SortService} from "../../service/sort.service";

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

  posts: Post[] = [];

  private unsubscribe$ = new Subject<void>();
  constructor(
    private readonly postsService: PostsService,
    private readonly sortService: SortService,
    private readonly changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.postsService.getList$().pipe(
      tap(posts => {
        this.posts = posts;
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

    this.sortService.sortTable(header, this.posts);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
