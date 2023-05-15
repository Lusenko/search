import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {TableLength} from "../../../enum/table-length";
import {FormControl} from "@angular/forms";
import {Subject, takeUntil, tap} from "rxjs";
import {SliceListService} from "../../../service/slice-list.service";
import {PostsService} from "../../../service/posts.service";
import {Post} from "../../../interface/post";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit, OnDestroy {

  dropDownList = [TableLength.default, TableLength.middle, TableLength.large]

  itemsControl = new FormControl(this.dropDownList[0], {nonNullable: true});

  allPages = 0;
  currentPage = 1;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly sliceListService: SliceListService<Post>,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly postsService: PostsService<Post>) { }

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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
