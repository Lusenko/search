import {Component} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent {

  color = new FormControl('#000000', Validators.pattern(/^#+([a-fA-F0-9]{6})$/))

  constructor() {}

}
