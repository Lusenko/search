import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output, SimpleChanges
} from '@angular/core';
import {TableLength} from "../../../enum/table-length";
import {FormControl} from "@angular/forms";
import {Subject, takeUntil, tap} from "rxjs";
import {SliceListService} from "../../../service/slice-list.service";
import {PostsService} from "../../../service/posts.service";
import {Post} from "../../../interface/post";
import {Slice} from "../../../interface/slice";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit, OnChanges, OnDestroy {

  dropDownList = [TableLength.default, TableLength.middle, TableLength.large];

  @Input() arrayLength = 0;
  @Output() sliceOperators = new EventEmitter<Slice>();

  itemsControl = new FormControl(this.dropDownList[0], {nonNullable: true});

  allPages = 0;
  currentPage = 1;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly sliceListService: SliceListService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly postsService: PostsService) { }

  ngOnInit(): void {
    this.itemsControl.valueChanges
      .pipe(
        tap(value => {
          this.allPages = this.arrayLength / Number(value);

          if(this.currentPage > this.allPages) {
            this.currentPage = this.allPages;
          }

          const slice = this.sliceListService.getSliceList(this.currentPage - 1, Number(value));

          this.sliceOperators.emit(slice);

          this.changeDetectorRef.markForCheck();
        }),
        takeUntil(this.unsubscribe$),
      ).subscribe()
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getList();
  }

  getList(): void {
    this.allPages = this.arrayLength / this.itemsControl.value;

    const slice = this.sliceListService.getSliceList(this.currentPage - 1, Number(this.itemsControl.value));

    this.sliceOperators.emit(slice);
  }

  nextPage(): void {
    if(this.currentPage === this.allPages) {
      return;
    }

    this.currentPage++;

    const slice = this.sliceListService.getSliceList(this.currentPage - 1, Number(this.itemsControl.value));

    this.sliceOperators.emit(slice);
  }

  previousPage(): void {
    if (this.currentPage === 1) {
      return;
    }

    this.currentPage--;

    const slice = this.sliceListService.getSliceList(this.currentPage - 1, Number(this.itemsControl.value));

    this.sliceOperators.emit(slice);
  }

  firstPage(): void {
    this.currentPage = 1;

    const slice = this.sliceListService.getSliceList(this.currentPage - 1, Number(this.itemsControl.value));

    this.sliceOperators.emit(slice);
  }

  lastPage(): void {
    this.currentPage = this.allPages;

    const slice = this.sliceListService.getSliceList(this.currentPage - 1, Number(this.itemsControl.value));

    this.sliceOperators.emit(slice);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
