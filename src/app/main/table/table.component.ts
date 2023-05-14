import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil, tap} from "rxjs";
import {Post} from "../../interface/post";
import {TableHeader} from "../../interface/table-header";
import {SortState} from "../../enum/sort-state";
import {PostsService} from "../../service/posts.service";
import {SortService} from "../../service/sort.service";
import {TableLength} from "../../enum/table-length";
import {FormControl} from "@angular/forms";
import {SliceListService} from "../../service/slice-list.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit, OnDestroy {

  dropDownList = [TableLength.default, TableLength.middle, TableLength.large]

  itemsControl = new FormControl(this.dropDownList[0], {nonNullable: true});

  headerList: TableHeader<Post>[] = [
    { head: 'id', sortedState: SortState.default },
    { head: 'title', sortedState: SortState.default },
    { head: 'body', sortedState: SortState.default }
  ]

  sortState: TableHeader<Post>;

  posts: Post[] = [];

  allPages = 0;
  currentPage = 1;

  private unsubscribe$ = new Subject<void>();
  constructor(
    private readonly postsService: PostsService,
    private readonly sortService: SortService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly sliceListService: SliceListService) { }

  ngOnInit(): void {
    this.itemsControl.valueChanges
      .pipe(
        tap(value => {
          this.allPages = this.sliceListService.posts.length / Number(value);

          if(this.currentPage > this.allPages) {
            this.currentPage = this.allPages;
          }

          const slice = this.sliceListService.getSliceList(this.currentPage - 1, Number(value));

          this.sliceListService.getPostList(slice);

          this.changeDetectorRef.markForCheck();
        }),
        takeUntil(this.unsubscribe$),
      ).subscribe()

    this.postsService.getList$().pipe(
      tap(posts => {
        this.allPages = posts.length / this.itemsControl.value;

        this.sliceListService.setPostList(posts);
        const slice = this.sliceListService.getSliceList(this.currentPage - 1, this.itemsControl.value);

        this.sliceListService.getPostList(slice);

        this.changeDetectorRef.markForCheck();
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()

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

  nextPage(): void {
    if(this.currentPage === this.allPages) {
      return;
    }

    this.currentPage++;

    const slice = this.sliceListService.getSliceList(this.currentPage - 1, Number(this.itemsControl.value));

    this.sliceListService.getPostList(slice);
  }

  previousPage(): void {
    if (this.currentPage === 1) {
      return;
    }

    this.currentPage--;

    const slice = this.sliceListService.getSliceList(this.currentPage - 1, Number(this.itemsControl.value));

    this.sliceListService.getPostList(slice);
  }

  firstPage(): void {
    this.currentPage = 1;

    const slice = this.sliceListService.getSliceList(this.currentPage - 1, Number(this.itemsControl.value));

    this.sliceListService.getPostList(slice);
  }

  lastPage(): void {
    this.currentPage = this.allPages;

    const slice = this.sliceListService.getSliceList(this.currentPage - 1, Number(this.itemsControl.value));

    this.sliceListService.getPostList(slice);
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
