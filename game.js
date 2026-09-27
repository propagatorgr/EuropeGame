const map = L.map('map').setView([55, 20], 5);

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
let allCountries = [];

let countryLayer;

let highScore =
    Number(localStorage.getItem("highScore")) || 0;

document.getElementById("highScore").textContent =
    highScore;

function updateStats() {

    document.getElementById("score").textContent =
        score;

    document.getElementById("correct").textContent =
        correct;

    document.getElementById("wrong").textContent =
        wrong;

    document.getElementById("remainingCount").textContent =
        remainingCountries.length;

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "highScore",
            highScore
        );

        document.getElementById("highScore").textContent =
            highScore;
    }
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

    const randomIndex =
        Math.floor(
            Math.random() * remainingCountries.length
        );

    currentCountry =
        remainingCountries[randomIndex];

    document.getElementById("targetCountry").textContent =
        currentCountry;
}

function newGame() {

    score = 0;
    correct = 0;
    wrong = 0;

    remainingCountries = [...allCountries];

    countryLayer.eachLayer(layer => {

        layer.setStyle({
            fillColor: "#4a90e2",
            fillOpacity: 0.7,
            weight: 1
        });

    });

    updateStats();

    nextCountry();
}

fetch("europe.geojson")
    .then(response => response.json())
    .then(data => {

        countryLayer = L.geoJSON(data, {

            style: {
                color: "#333",
                weight: 1,
                fillColor: "#4a90e2",
                fillOpacity: 0.7
            },

            onEachFeature: function(feature, layer) {

                const countryName =
                    feature.properties.NAME ||
                    feature.properties.ADMIN;

                if (countryName) {

                    remainingCountries.push(countryName);
                    allCountries.push(countryName);
                }

                layer.on("mouseover", function() {

                    if (
                        layer.options.fillColor !== "green"
                    ) {

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

        map.fitBounds(
            countryLayer.getBounds()
        );

        updateStats();
        nextCountry();

    });

document
    .getElementById("newGameBtn")
    .addEventListener(
        "click",
        newGame
    );
