/* 
 * Ce fichier sert à afficher les parkings réservés et les passages piétons.
 * Copyleft Philippe Poisse
 * Licence GPL V3.
 */

/*
 * Fonctions spécifiques
 */

/*
 * Gestions des données.
 */

//Fonction qui acceuille le layer "parking"
var parking_h;

parking_h = L.layerJSON({
	url: 'http://overpass-api.de/api/interpreter?data=[out:json];node({lat1},{lon1},{lat2},{lon2})[amenity=parking_space]["capacity:disabled"];out;',
	propertyItems: 'elements',
	propertyTitle: 'tags.name',
	propertyLoc: ['lat','lon'],
        buildIcon: function(data, title) {
            return new L.Icon({
            iconUrl:'images/parking_wheelchair_only.png',
            iconSize: new L.Point(32, 37),
            iconAnchor: new L.Point(18, 37),
            popupAnchor: new L.Point(0, -37)
            });
	},

	buildPopup: function(data, marker) {
            capacity_test = "capacity:disabled";
            nbr_place = "Nombre de places réservées : " + data.tags["capacity:disabled"];

            return nbr_place || null;
	}
});

//Fonction qui acceuille le layer "passage_pietons"
var passage_pieton;

passage_pieton = L.layerJSON({
	url: 'http://overpass-api.de/api/interpreter?data=[out:json];node({lat1},{lon1},{lat2},{lon2})[highway=crossing];out;',
	propertyItems: 'elements',
	propertyTitle: 'tags.name',
	propertyLoc: ['lat','lon'],
 /*       buildIcon: function(data, title) {
            return new L.Icon({
            iconUrl:'bar.png',
            iconSize: new L.Point(32, 37),
            iconAnchor: new L.Point(18, 37),
            popupAnchor: new L.Point(0, -37)
            });
	},
    */
	buildPopup: function(data, marker) {
            wheelchair = "fauteuil roulant : " + data.tags.wheelchair + "<br />";
            blind =  "Podotactile : " + data.tags.tactile_paving + "<br />";
            type = "Type de passage piéton : " + data.tags.crossing + " - " + data.tags.crossing_ref + "<br />";
            text = wheelchair + blind + type;
		return text || null;
	}
});

/*
 * Création de la carte
 */

//Fond de carte Mapbox
var mapbox = L.tileLayer('http://{s}.tiles.mapbox.com/v3/phil6611.ikebkh58/{z}/{x}/{y}.png', {
                attribution: 'Carte des parkings réservés handicapés &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
            });

//Création de la carte.
var map = L.map('map', {
    center: new L.LatLng(42.698611, 2.895556),
    zoom: 15,
    maxZoom: 18,
    layers: [mapbox, parking_h]
});

/*
 * Création des contrôles.
 */

//Contrôles pour les fonds de cartes.
var baseMap = {
    "Rendu Mapbox" : mapbox
};

//Contrôles pour les layers contenant les données.
var overlaysMaps = {
    "Parkings réservés" : parking_h,
    "Passages piétons" : passage_pieton
};

L.control.layers(baseMap, overlaysMaps,{ collapsed: true }).addTo(map);
L.control.scale({imperial: false}).addTo(map);


