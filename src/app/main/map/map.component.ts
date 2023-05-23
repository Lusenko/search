import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {FormBuilder} from "@angular/forms";
import {Subject} from "rxjs";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, OnDestroy {

  coordinateForm = this.formBuilder.group({
    latitude: '',
    longitude: ''
  })

  private map: L.Map;
  private unsubscribe$ = new Subject<void>();
  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createMap();
  }

  createMap(): void {
    const coordinates = {
      lat: 48.539927079257815,
      lng: 32.53492066116194,
    };

    const zoomLevel = 12;

    this.map = L.map('map').setView([coordinates.lat, coordinates.lng], zoomLevel);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 12,
      maxZoom: 17,
    }).addTo(this.map);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
