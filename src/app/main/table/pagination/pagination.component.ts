import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {TableLength} from "../../../enum/table-length";
import {FormControl} from "@angular/forms";
import {Subject, takeUntil, tap} from "rxjs";
import {SliceListService} from "../../../service/slice-list.service";
import {Slice} from "../../../interface/slice";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit, OnDestroy {

  dropDownList = [TableLength.default, TableLength.middle, TableLength.large];

  @Input() set arrayLength(value: number) {
    this.allPages = value / this.itemsControl.value;

    const slice = this.sliceListService.getSlice(this.currentPage - 1, Number(this.itemsControl.value));

    this.paginationChange.emit(slice);
  };

  @Output() paginationChange = new EventEmitter<Slice>();

  itemsControl = new FormControl(this.dropDownList[0], {nonNullable: true});

  allPages = 0;
  currentPage = 1;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly sliceListService: SliceListService,
    private readonly changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.itemsControl.valueChanges
      .pipe(
        tap(value => {
          this.allPages = this.arrayLength / Number(value);

          if(this.currentPage > this.allPages) {
            this.currentPage = this.allPages;
          }

          const slice = this.sliceListService.getSlice(this.currentPage - 1, Number(value));

          this.paginationChange.emit(slice);

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

    const slice = this.sliceListService.getSlice(this.currentPage - 1, Number(this.itemsControl.value));

    this.paginationChange.emit(slice);
  }

  previousPage(): void {
    if (this.currentPage === 1) {
      return;
    }

    this.currentPage--;

    const slice = this.sliceListService.getSlice(this.currentPage - 1, Number(this.itemsControl.value));

    this.paginationChange.emit(slice);
  }

  firstPage(): void {
    this.currentPage = 1;

    const slice = this.sliceListService.getSlice(this.currentPage - 1, Number(this.itemsControl.value));

    this.paginationChange.emit(slice);
  }

  lastPage(): void {
    this.currentPage = this.allPages;

    const slice = this.sliceListService.getSlice(this.currentPage - 1, Number(this.itemsControl.value));

    this.paginationChange.emit(slice);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
