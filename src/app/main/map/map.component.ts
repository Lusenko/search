import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {FormBuilder} from "@angular/forms";
import {Subject} from "rxjs";
import {Coordinates} from "../../interface/coordinates";
import 'leaflet-draw'

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
  private drawItems = new L.FeatureGroup();

  private defaultIcon = L.icon({
    iconUrl: 'assets/marker/icon.png',
    iconSize: [25,25],

  })
  private customIcon = L.icon({
    iconUrl: 'assets/marker/pin.png',
    iconSize: [25,25],
  })

  private unsubscribe$ = new Subject<void>();
  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createMap();
    this.drawOnMap();
  }

  createMap(): void {
    const coordinates: Coordinates = {
      lat: 48.539927079257815,
      lng: 32.53492066116194,
    };

    const zoomLevel = 12;

    this.map = L.map('map').setView([coordinates.lat, coordinates.lng], zoomLevel);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 12,
      maxZoom: 17,
    }).addTo(this.map);

    const defaultMarker = L.marker([coordinates.lat, coordinates.lng], {icon: this.defaultIcon, draggable: true})
      .addTo(this.map)
      .on('click', () => {
        const coord = String(defaultMarker.getLatLng()).split(',');
        const lat = coord[0].split('(');
        const lng = coord[1].split(')');

        this.coordinateForm.setValue({latitude: lat[1].trim(), longitude: lng[0].trim()})
      });
  }

  addMarker(): void {
    const coordinates: Coordinates = {
      lat: Number(this.coordinateForm.get('latitude')?.value) ?? '',
      lng: Number(this.coordinateForm.get('longitude')?.value) ?? ''
    }

    const marker = L.marker([coordinates.lat, coordinates.lng], {icon: this.customIcon, draggable: true})
      .addTo(this.map).on('click', () => {
      const coord = String(marker.getLatLng()).split(',');
      const lat = coord[0].split('(');
      const lng = coord[1].split(')');

      this.coordinateForm.setValue({latitude: lat[1].trim(), longitude: lng[0].trim()})
    });

    this.coordinateForm.reset();
  }

  drawOnMap(): void {
    const drawControl = new L.Control.Draw ({
      edit: {
        featureGroup: this.drawItems,
      },
      draw: {
        polygon: {
          shapeOptions: {
            color: '#000000',
            fillColor: '#262626'
          }
        }
      }
    });

    this.map.addControl(drawControl);

    this.map.on(L.Draw.Event.CREATED, event => {
      this.drawItems.addLayer(event.layer).addTo(this.map);
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
