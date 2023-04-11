import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Color} from "../../../../interface/color";

@Component({
  selector: 'app-drop-down-list',
  templateUrl: './drop-down-list.component.html',
  styleUrls: ['./drop-down-list.component.scss']
})
export class DropDownListComponent implements OnInit, AfterViewInit {
  @Input() colorList: Color[] = [];
  @Output() selectedColor = new EventEmitter<string>();

  colorIndex = -1;

  constructor() { }

  focusOnColor(index: number): void {
    this.colorIndex = index;
    this.selectedColor.emit(this.colorList[index].color);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

}
