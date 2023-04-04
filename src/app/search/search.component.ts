import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {InfoService} from "../../service/info.service";
import { FormControl, Validators} from "@angular/forms";
import {
  debounceTime,
  filter,
  fromEvent,
  Subject,
  switchMap,
  takeUntil,
  tap
} from "rxjs";
import {Items} from "../../interface/items";
import {Info} from "../../interface/info";
import {removeSpaces} from '../../ts/removeSpace';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dropdown') dropdown: ElementRef | undefined;
  @ViewChild('input') input: ElementRef | undefined;

  search = new FormControl('',[
    Validators.required,
    removeSpaces
  ]);

  selectTitleIndex = 0;
  selectValue = '';

  isShowDropdown = false;

  titleList: Items[] = [];

  private unsubscribe$ = new Subject<void>();
  constructor(private readonly infoService: InfoService) { }

  ngOnInit(): void {
    this.search.valueChanges.pipe(
      debounceTime(500),
      filter(val => val !== ''),
      switchMap(val => {
        return this.infoService.getInfo(val ?? '').pipe(
          tap(({items}: Info) => {
            this.titleList = items;
            this.isShowDropdown = true;
          } ),
        )
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()
  }

  clickOnSelectElement(index: number): void {
    this.selectTitleIndex = index;
    this.selectValue = this.titleList[index].title;
    this.isShowDropdown = false;
  }

  ngAfterViewInit(): void {
    fromEvent<KeyboardEvent>(window, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.key === 'ArrowDown'),
      tap(() => {
        const selectTitle = document.querySelector('.focus') as HTMLDivElement;
        const lastTitleIndex = this.titleList.length - 1;

        this.selectTitleIndex++;

        if(this.dropdown) {
          if(selectTitle) {
            this.dropdown.nativeElement.scrollTop = selectTitle.offsetTop - 250;
          }

          if(this.selectTitleIndex > lastTitleIndex) {
            this.selectTitleIndex = 0;
            this.dropdown.nativeElement.scrollTop = 0;
          }
        }
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()

    fromEvent<KeyboardEvent>(window, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.key === 'ArrowUp'),
      tap(() => {
        const selectTitle = document.querySelector('.focus') as HTMLDivElement;
        const lastTitleIndex = this.titleList.length - 1;

        this.selectTitleIndex--;

        if (this.dropdown) {
          if (selectTitle) {
            this.dropdown.nativeElement.scrollTop = selectTitle.offsetTop - 250;
          }

          if (this.selectTitleIndex === -1) {
            this.selectTitleIndex = lastTitleIndex;
            this.dropdown.nativeElement.scrollTop = this.dropdown.nativeElement.scrollHeight;
          }
        }
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()

    fromEvent<KeyboardEvent>(window, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.key === 'Enter'),
      tap(() => {
        this.selectValue = this.titleList[this.selectTitleIndex].title;
        this.isShowDropdown = false;
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()

    fromEvent(window, 'click').pipe(
      filter(e => e.target !== this.dropdown?.nativeElement && e.target !== this.input?.nativeElement),
      tap(() => this.isShowDropdown = false),
      takeUntil(this.unsubscribe$),
    ).subscribe()

    fromEvent(window, 'click').pipe(
      filter(e => e.target === this.input?.nativeElement && this.search.value !== ''),
      tap(() => this.isShowDropdown = true),
      takeUntil(this.unsubscribe$),
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
