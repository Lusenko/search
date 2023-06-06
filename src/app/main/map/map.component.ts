import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import * as L from 'leaflet';
import {FormBuilder} from "@angular/forms";
import {filter, fromEvent, Subject, takeUntil, tap} from "rxjs";
import {Coordinates} from "../../interface/coordinates";
import 'leaflet-draw'
import {getMarkerCoord} from "../../shared/getMarkerCoord";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('latInput') inputLatitude: ElementRef;

  coordinateForm = this.formBuilder.group({
    latitude: '',
    longitude: ''
  })

  private map: L.Map;
  private drawItems = new L.FeatureGroup();

  private customIcon = L.icon({
    iconUrl: 'assets/marker/pin.png',
    iconSize: [25,25],
  })

  private unsubscribe$ = new Subject<void>();

  constructor(private readonly formBuilder: FormBuilder, private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.createMap();
    this.drawOnMap();
    this.getGeoCoordinate();
  }

  addMarker(): void {
    const coordinates: Coordinates = {
      lat: Number(this.coordinateForm.get('latitude')?.value) ?? '',
      lng: Number(this.coordinateForm.get('longitude')?.value) ?? ''
    }

    const marker = L.marker([coordinates.lat, coordinates.lng], {icon: this.customIcon, draggable: true})
      .addTo(this.map).on('click', () => {
        const coord = getMarkerCoord(marker);
        this.coordinateForm.setValue({latitude: coord[0].trim(), longitude: coord[1].trim()})
      });

    const geoCoordinates = localStorage.getItem('geoCoord');

    L.geoJSON().addData(JSON.parse(geoCoordinates ?? '')).eachLayer(() => {
      this.drawItems.addLayer(marker);

      localStorage.setItem('geoCoord', JSON.stringify(this.drawItems.toGeoJSON()));
    });

    this.coordinateForm.reset();
  }

  private createMap(): void {
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

    const defaultMarker = L.marker([coordinates.lat, coordinates.lng], {icon: this.customIcon, draggable: true})
      .addTo(this.drawItems)
      .on('click', () => {
        const coord = getMarkerCoord(defaultMarker);

        this.coordinateForm.setValue({latitude: coord[0].trim(), longitude: coord[1].trim()})
      });

    this.drawItems.addTo(this.map);
  }

  private getGeoCoordinate(): void {
    const geoCoordinates = localStorage.getItem('geoCoord');

    if (geoCoordinates !== null) {
      L.geoJSON().addData(JSON.parse(geoCoordinates)).eachLayer(layer => {

        layer.addTo(this.drawItems);

        if (layer instanceof L.Marker) {
          layer.setIcon(this.customIcon);
        }


        /*if (layer instanceof L.Marker) {
          layer.setIcon(this.customIcon).on("move", () => {
            this.drawItems.addLayer(layer);

            const coord = getMarkerCoord(layer);

            localStorage.setItem('geoCoord', JSON.stringify(layer.toGeoJSON()));

            this.coordinateForm.setValue({latitude: coord[0].trim(), longitude: coord[1].trim()})
          });

          layer.options.draggable = true;
        }*/
      }).setStyle({
        color: '#000000',
        fillColor: '#262626'
      });
    }
  }

  private drawOnMap(): void {
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: this.drawItems,
      },
      draw: {
        marker: {
          icon: this.customIcon
        },
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

      localStorage.setItem('geoCoord', JSON.stringify(this.drawItems.toGeoJSON()));
    })
  }

  private getElementWithClipBord(): void {
    navigator["clipboard"].readText().then(data => {
      const coord = data?.split(',') ?? '';

      this.coordinateForm.setValue({latitude: coord[0], longitude: coord[1]?.trim()}, {emitEvent: false});
    })
  }

  ngAfterViewInit(): void {
    fromEvent<KeyboardEvent>(this.inputLatitude.nativeElement, 'keydown').pipe(
      filter(event => event.ctrlKey && event.keyCode === 86),
      tap(() => {
        this.getElementWithClipBord();

        this.changeDetectorRef.markForCheck();
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
