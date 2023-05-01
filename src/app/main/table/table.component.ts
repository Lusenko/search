import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from "../../../service/posts.service";
import {Subject, takeUntil, tap} from "rxjs";
import {Posts} from "../../../interface/posts";
import {TableHeader} from "../../../interface/table-header";
import {SortState} from "../../../enum/sort-state";
import {SortService} from "../../../service/sort.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  headerList: TableHeader[] = [
    {head: 'id', sorted_state: SortState.default},
    {head: 'title', sorted_state: SortState.default},
    {head: 'body', sorted_state: SortState.default}
  ]

  tableList: Posts[] = [];

  private unsubscribe$ = new Subject<void>();
  constructor(private readonly postsService: PostsService, private readonly sortService: SortService) { }

  ngOnInit(): void {
    this.postsService.getPostsInfo().pipe(
      tap(x => this.tableList = x),
      takeUntil(this.unsubscribe$),
    ).subscribe()
  }

  sortData(sortData: TableHeader): void {
    this.headerList = this.headerList.map(val => {
      if(val.head !== sortData.head) {
        val.sorted_state = SortState.default;

        return val;
      }

      val.sorted_state = sortData.sorted_state;

      return val;
    })

    this.sortService.sortingTable(sortData, this.tableList)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
