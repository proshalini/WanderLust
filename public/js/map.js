mapboxgl.accessToken =mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center:listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 8 // starting zoom
    });


    const marker1 = new mapboxgl.Marker({color:"Red"})
        .setLngLat(listing.geometry.coordinates)
         .setPopup(new mapboxgl.Popup().setHTML(`<h4>${listing.title}</h4> <p>Exact location is provided after booking</p>`))
        .addTo(map);