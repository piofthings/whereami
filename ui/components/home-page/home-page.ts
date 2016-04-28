/// <amd-dependency path="text!./home-page.html" />

export var template = require("text!./home-page.html");
import ko = require("knockout");
export class viewModel
{
    title: KnockoutObservable<string> = ko.observable("Home page");
    topSpeedInMph: KnockoutObservable<number> = ko.observable<number>(0);
    averageSpeedInMph : KnockoutObservable<number> = ko.observable<number>(0);
    linePoints: Array<L.LatLng> = [];
    constructor(params)
    {
        L.mapbox.accessToken = 'pk.eyJ1Ijoic3VtaXRrbSIsImEiOiJjaW1wOXV2N2kwMDNtdzNrcHg2cWRvd2RvIn0.NNl0y0W49ES3PDtFRgnuwg';
        let map = L.mapbox.map('map', 'mapbox.streets');
        map.setView([51.328558	, -1.45734	], 17);
        let polyline_options = {
            color: '#000'
        };

        let polyline = <any>L.polyline(this.linePoints, polyline_options).addTo(map);

        ipcRenderer.on("Events.GpsReaderEvents.ReadGPRMC", (event, data) => {
            if(data.gpsPoint.latitudeDegrees!=0 || data.gpsPoint.longitudeDegrees != 0)
            {
                this.linePoints.push(new L.LatLng(data.gpsPoint.latitudeDegrees, data.gpsPoint.longitudeDegrees));
            }
        });

        ipcRenderer.on("Events.GpsReaderEvents.EndParsing", (event, data) =>
        {
            polyline.setLatLngs(this.linePoints);
            let topSpeedPoint = data.topSpeedPoint;
            L.marker([topSpeedPoint.latitudeDegrees, topSpeedPoint.longitudeDegrees], {
                icon: L.mapbox.marker.icon({
                    'marker-size': 'large',
                    'marker-symbol': 'bus',
                    'marker-color': '#fa0'
                })
            }).addTo(map);
            this.topSpeedInMph(data.topSpeed);
            this.averageSpeedInMph(data.averageSpeed);
            map.fitBounds(polyline.getBounds());
        });

        ipcRenderer.on("Events.GpsReaderEvents.BeginParsing", (event, data) =>
        {
            polyline.setLatLngs([]);
            map.setView([51.328558	, -1.45734], 12);
        });
    }
}
