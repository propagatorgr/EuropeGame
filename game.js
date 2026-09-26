const map = L.map('map');

let score = 0;
let correct = 0;
let wrong = 0;

let countries = [];
let remainingCountries = [];

let currentCountry = null;

function updateStats() {

    document.getElementById("score").textContent = score;
    document.getElementById("correct").textContent = correct;
    document.getElementById("wrong").textContent = wrong;

}

function nextCountry() {

    if (remainingCountries.length === 0) {

        document.getElementById("targetCountry").textContent =
            "ΟΛΟΚΛΗΡΩΘΗΚΕ";

        alert(
            "Το παιχνίδι ολοκληρώθηκε!\n\n" +
            "Σκορ: " + score +
            "\nΣωστές: " + correct +
            "\nΛάθη: " + wrong
        );

        return;
    }

    const randomIndex =
        Math.floor(
            Math.random() * remainingCountries.length
        );

    currentCountry =
        remainingCountries[randomIndex];

    document.getElementById("targetCountry").textContent =
        currentCountry;
}

fetch("europe.geojson")

.then(response => response.json())

.then(data => {

    countries = data.features.map(
        feature => feature.properties.NAME
    );

    remainingCountries = [...countries];

    const geoLayer = L.geoJSON(data, {

        style: {
            color: "#333",
            weight: 1,
            fillColor: "#4a90e2",
            fillOpacity: 0.7
        },

        onEachFeature: function(feature, layer) {

            layer.on("mouseover", function() {

                if (layer.options.fillColor !== "green") {

                    layer.setStyle({
                        weight: 3
                    });

                }

            });

            layer.on("mouseout", function() {

                layer.setStyle({
                    weight: 1
                });

            });

            layer.on("click", function() {

                if (!currentCountry) return;

                const clickedCountry =
                    feature.properties.NAME;

                if (clickedCountry === currentCountry) {

                    score += 10;
                    correct++;

                    layer.setStyle({
                        fillColor: "green",
                        fillOpacity: 0.8
                    });

                    remainingCountries =
                        remainingCountries.filter(
                            country => country !== currentCountry
                        );

                    updateStats();

                    nextCountry();

                } else {

                    score -= 2;
                    wrong++;

                    updateStats();

                    layer.setStyle({
                        fillColor: "red"
                    });

                    setTimeout(() => {

                        if (
                            layer.options.fillColor !== "green"
                        ) {

                            layer.setStyle({
                                fillColor: "#4a90e2"
                            });

                        }

                    }, 500);

                }

            });

        }

    }).addTo(map);

    map.fitBounds(
        geoLayer.getBounds()
    );

    nextCountry();

});
