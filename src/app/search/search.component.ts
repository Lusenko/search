import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {InfoService} from "../../service/info.service";
import {FormControl} from "@angular/forms";
import {debounceTime, filter, fromEvent, Subject, switchMap, takeUntil, tap} from "rxjs";
import {Items} from "../../interface/items";
import {Info} from "../../interface/info";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dropdown') dropdown: ElementRef | undefined;

  search = new FormControl('');

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
      tap((event: KeyboardEvent) => {
        const selectTitle = document.querySelector('.focus') as HTMLDivElement;
        const lastTitleIndex = this.titleList.length - 1;

        if(event.key === 'ArrowDown') {
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
        }

        if(event.key === 'ArrowUp') {
          this.selectTitleIndex--;

          if(this.dropdown) {
            if(selectTitle) {
              this.dropdown.nativeElement.scrollTop = selectTitle.offsetTop - 250;
            }

            if(this.selectTitleIndex === -1) {
              this.selectTitleIndex = lastTitleIndex;
              this.dropdown.nativeElement.scrollTop = this.dropdown.nativeElement.scrollHeight;
            }
          }
        }

        if(event.key === 'Enter') {
          this.selectValue = this.titleList[this.selectTitleIndex].title;
          this.isShowDropdown = false;
        }
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
