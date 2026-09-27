const map = L.map('map').setView([54, 15], 4);
 
L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
attribution: '&copy; OpenStreetMap contributors'
}
).addTo(map);
 
let score = 0;
let correct = 0;
let wrong = 0;
let currentCountry = null;
let remainingCountries = [];


function updateStats() {
    document.getElementById("score").textContent = score;
    document.getElementById("correct").textContent = correct;
    document.getElementById("wrong").textContent = wrong;
}

function nextCountry() {

    if (remainingCountries.length === 0) {

        document.getElementById("targetCountry").textContent =
            "ΤΕΛΟΣ ΠΑΙΧΝΙΔΙΟΥ";

        alert(
            "Παιχνίδι ολοκληρώθηκε!\n\n" +
            "Σκορ: " + score +
            "\nΣωστές: " + correct +
            "\nΛάθη: " + wrong
        );

        currentCountry = null;
        return;
    }

    const randomIndex = Math.floor(
        Math.random() * remainingCountries.length
    );

    currentCountry = remainingCountries[randomIndex];

    document.getElementById("targetCountry").textContent =
        currentCountry;
}

fetch("europe.geojson")
    .then(response => response.json())
    .then(data => {

        const countryLayer = L.geoJSON(data, {

            style: {
                color: "#333",
                weight: 1,
                fillColor: "#4a90e2",
                fillOpacity: 0.7
            },

            onEachFeature: function (feature, layer) {

                const countryName =
                    feature.properties.NAME ||
                    feature.properties.ADMIN;

                if (countryName) {
                    remainingCountries.push(countryName);
                }

                layer.on("mouseover", function () {

                    if (layer.options.fillColor !== "green") {

                        layer.setStyle({
                            weight: 3
                        });

                    }

                });

                layer.on("mouseout", function () {

                    layer.setStyle({
                        weight: 1
                    });

                });

                layer.on("click", function () {

                    if (!currentCountry) return;

                    if (countryName === currentCountry) {

                        score += 10;
                        correct++;

                        layer.setStyle({
                            fillColor: "green",
                            fillOpacity: 0.8
                        });

                        remainingCountries =
                            remainingCountries.filter(
                                c => c !== currentCountry
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

        map.fitBounds(countryLayer.getBounds());
        map.setView([54, 15], 4);
        nextCountry();
    });
