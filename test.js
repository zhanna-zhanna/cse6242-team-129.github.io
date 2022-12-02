// const apiBase = "//localhost:8000";
const apiBase = "//violetredafraidstacks.jsaunders40.repl.co";


async function getData(endPoint = '') {
  // Default options are marked with *
  const response = await fetch(apiBase+endPoint, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

// getData('')
//   .then((data) => {
//     const filteredData = data.filter(d => d.label == 1)
//     console.log(filteredData); // JSON data parsed by `data.json()` call
//   });


async function getCsv(filePath = 'vis_data_short.csv') {
    // Default options are marked with *
    const response = await fetch(filePath, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      // headers: {
      //   'Content-Type': 'application/json'
      //   // 'Content-Type': 'application/x-www-form-urlencoded',
      // },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.text(); // parses JSON response into native JavaScript objects
  }


// 1. create global map, base/tile layer, and current objects
// 2. fetch the data from the server and process
// 3. fetch the CSV file and process
const tile_layer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    "attribution":
    "Data by &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
    "detectRetina": false,
    "maxNativeZoom": 18,
    "maxZoom": 18,
    "minZoom": 6,
    "noWrap": false,
    "opacity": 1,
    "subdomains": "abc",
    "tms": false
  }
);

// heat map prediction layer
let heat_map = L.layerGroup();

// heat map layer for historical data
let historical_heat_map = L.layerGroup();

const map = L.map(
  "map",
  {
      center: [34.2012, -118.4662],
      crs: L.CRS.EPSG3857,
      zoom: 11,
      //scaleRadius: false,
      zoomControl: true,
      preferCanvas: false,
      layers: [tile_layer,]
  }
);

// const baseLayer = {
//   "OpenStreetMap": tile_layer
// }

// let layerControl = L.control.layers(baseLayer).addTo(map)
let layerControl = L.control.layers().addTo(map);

let sidebar = L.control.sidebar('sidebar').addTo(map);
sidebar.open('home');

let datetime = new Date();
document.getElementById("time").textContent = datetime;

document.onload = (() => {
  getData().then(data => {
    let weather = data["weather"];
    if (weather) {
      let weatherT = weather["Temperature(F)"];
      let weatherH = weather["Humidity(%)"];
      //var weatherP = Number(weather["Pressure(in)"]).toFixed(2);
      document.getElementById("weatherT").textContent = weatherT;
      document.getElementById("weatherH").textContent = weatherH;
      //document.getElementById("weatherP").textContent = weatherP;
    }

    // READ DATA
    let preds = data["predictions"];
    let heatData = [];
    for (let i=1; i<preds.length; i++) {
        let parts = preds[i];
        if (preds["label"] != "0"){
          heatData.push([+parts["lat"], +parts["lon"]]);
        }
    }
    console.log(zipCode);
  }).catch(error => console.error(error))
  .then(() => {
    heat_map = L.heatLayer(heatData, {"radius": 15});
    layerControl.addOverlay(heat_map, "Real Time Data");
  });

  // Promise.all(zip_codes.map(zipCode => {
  //     getData(`/predict/zip/${zipCode}`).then(data => {
  //       let weather = data["weather"];
  //       if (weather) {
  //         let weatherT = weather["Temperature(F)"];
  //         let weatherH = weather["Humidity(%)"];
  //         //var weatherP = Number(weather["Pressure(in)"]).toFixed(2);
  //         document.getElementById("weatherT").textContent = weatherT;
  //         document.getElementById("weatherH").textContent = weatherH;
  //         //document.getElementById("weatherP").textContent = weatherP;
  //       }

  //       // READ DATA
  //       data = data["predictions"];
  //       let arr = [];
  //       for (let i=1; i<data.length; i++) {
  //           let parts = data[i];
  //           if (parts["label"] != "0"){
  //             arr.push([+parts["lat"], +parts["lon"]]);
  //           }
  //       }
  //       console.log(zipCode);
  //       heatData.push(...arr);
  //     });
  //   })
  // ).finally(() => {
    // heat_map = L.heatLayer(heatData, {"radius": 15});
    // layerControl.addOverlay(heat_map, "Real Time Data");
  // }).catch(err => console.error(err));
  // zip_codes.forEach(zipCode => {
  //   getData(`/predict/zip/${zipCode}`).then(data => {
  //     let weather = data["weather"];
  //     let weatherT = weather["Temperature(F)"];
  //     let weatherH = weather["Humidity(%)"];
  //     //var weatherP = Number(weather["Pressure(in)"]).toFixed(2);
  //     document.getElementById("weatherT").textContent = weatherT;
  //     document.getElementById("weatherH").textContent = weatherH;
  //     //document.getElementById("weatherP").textContent = weatherP;

  //     // READ DATA
  //     data = data["predictions"];
  //     let arr = [];
  //     for (let i=1; i<data.length; i++) {
  //         let parts = data[i];
  //         if (parts["label"] != "0"){
  //           arr.push([+parts["lat"], +parts["lon"]]);
  //         }
  //     }
  //     console.log(zipCode);
  //     heatData.push(...arr);
  //   });
  //   // setTimeout(0.01);
  // });
  // heat_map = L.heatLayer(heatData, {"radius": 15});
  // layerControl.addOverlay(heat_map, "Real Time Data");

  let historicalData = [];
  getCsv().then(text => {
    let lines = text.split("\n");

    for (let i=1; i<lines.length - 1; i++) {  // skip the title
        let parts = lines[i].split(",");
        historicalData.push([+parts[4], +parts[5]]);
    }

  }).finally(() => {
    historical_heat_map = L.heatLayer(historicalData, {"radius": 15})
    layerControl.addOverlay(historical_heat_map, "Historical Data");
  })
})();
