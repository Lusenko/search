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

  unsubscribe$ = new Subject<void>();
  constructor(private readonly postsService: PostsService, private readonly sortService: SortService) { }

  ngOnInit(): void {
    this.postsService.getPostsInfo().pipe(
      tap(x => this.tableList = x),
      takeUntil(this.unsubscribe$),
    ).subscribe()
  }

  sortData(data: TableHeader): void {
    this.sortService.sortingTable(data, this.tableList)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
