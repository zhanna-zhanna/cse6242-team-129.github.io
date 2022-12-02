const apiBase = "//localhost:8000";

async function getCsv(filePath = 'vis_data_short.csv') {
    // Default options are marked with *
    const response = await fetch(filePath);
    return response.text(); // parses JSON response into native JavaScript objects
}

async function getData(endPoint = '') {
    // Default options are marked with *
    const response = await fetch(apiBase+endPoint);
    return response.json(); // parses JSON response into native JavaScript objects
  }

getData()
  .then(data => {
    // console.log(data);

    console.log("Getting CSV file...");
    getCsv()
        .then(text => console.log("This is the text in the CSV file" + text));

    console.log("Finished getting data from CSV file")
  })