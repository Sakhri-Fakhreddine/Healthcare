import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private map!: L.Map;
  private userLocation!: L.LatLng;  // Position de l'utilisateur

  private initMap(lat: number, lon: number): void {
    this.map = L.map('map', {
      center: [lat, lon],
      zoom: 13,
      minZoom: 5,
      maxZoom: 18,
      zoomControl: true
    });

    // Utiliser une tuile de CartoDB pour une meilleure lisibilité
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap © CartoDB'
    }).addTo(this.map);

    // Ajouter un marqueur pour la position de l'utilisateur
    L.marker([lat, lon]).addTo(this.map)
      .bindPopup('Vous êtes ici')
      .openPopup();
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;  // Rayon de la terre en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;  // Distance en km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private searchDoctorsNearby(lat: number, lon: number): void {
    const query = 'doctor';
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=10&lat=${lat}&lon=${lon}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        let closestDoctor: any = null;
        let minDistance = Infinity;

        data.forEach((doctor: any) => {
          const doctorLat = parseFloat(doctor.lat);
          const doctorLon = parseFloat(doctor.lon);
          const distance = this.calculateDistance(lat, lon, doctorLat, doctorLon);

          if (distance < minDistance) {
            minDistance = distance;
            closestDoctor = doctor;
          }
        });

        if (closestDoctor) {
          const doctorLat = parseFloat(closestDoctor.lat);
          const doctorLon = parseFloat(closestDoctor.lon);
          L.marker([doctorLat, doctorLon]).addTo(this.map)
            .bindPopup(`<b>${closestDoctor.display_name}</b><br>Distance: ${minDistance.toFixed(2)} km`)
            .openPopup();
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des médecins :', error);
      });
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      this.initMap(lat, lon);
      this.searchDoctorsNearby(lat, lon);
    }, () => {
      console.error('Impossible de récupérer la position de l\'utilisateur');
    });

    window.addEventListener('resize', () => {
      this.map.invalidateSize();
    });
  }
}