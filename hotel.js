// const ids = require("ids.json");
const fetch = require("cross-fetch");
const fs = require('fs');

function getNameAndHospital(text = "") {

  const regex = /(?<='<li class="list-group-item">)(.*)(?=<\/li>';)/g;
  
  const results = text.match(regex)
  
  return results ? results[1] || results[0] + " -- try with idex 0 --" : "NOT DETECT";
}

async function getDetail(id) {
  // https://web.thailandsha.com/shalists/detail/327
    const response = await fetch("https://web.thailandsha.com/shalists/detail/"+id);

    const text = await response.text();

    const name = getNameAndHospital(text);

    return name;
}

const ids = ["70531","68655","67246","66432","66057"]
const json = {};
function worker() {

  const tasks = [];
  
  for (let id of ids) {

    tasks.push(new Promise(async(r, e) => {
      const name = await getDetail(id);

      r(name)
    }))
  }

  Promise.all(tasks).then((values) => {

    for (let i=0; i<values.length; i++) {
      json[ids[i]] = values[i];
    }

    save(JSON.stringify(json));
  });
}

worker();


function save(string) {

  fs.writeFile('hospital.json', string, function (err) {
    if (err) return console.log(err);
    console.log("save ot ids.json file");
  });
  }