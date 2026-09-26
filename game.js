const map = L.map('map').setView([54,15], 4);



fetch("europe.geojson")
.then(response => response.json())
.then(data => {

    L.geoJSON(data, {

        style: {
            color: "#333",
            weight: 1,
            fillColor: "#4a90e2",
            fillOpacity: 0.7
        },

        onEachFeature: function(feature, layer) {

            layer.on("click", function() {

                const name =
                    feature.properties.NAME_EL ||
                    feature.properties.name_el ||
                    feature.properties.NAME;

                document.getElementById("info").innerText =
                    "Επέλεξες: " + name;

                console.log(name);

            });

        }

    }).addTo(map);

});