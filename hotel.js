// const ids = require("ids.json");
const fetch = require("cross-fetch");
const fs = require('fs');

function getNameAndHospital(text = "") {

  const regex = /(?<='<li class="list-group-item">)(.*)(?=<\/li>';)/g;
  
  const results = text.match(regex)
  
  return results[1];
}

async function getDetail(id) {
  // https://web.thailandsha.com/shalists/detail/327
    const response = await fetch("https://web.thailandsha.com/shalists/detail/"+id);

    const text = await response.text();

    const name = getNameAndHospital(text);

    return name;
}

const ids = ["70531","68655","67246","66432","66057"]
function worker() {

  const tasks = [];
  
  for (let id of ids) {

    tasks.push(new Promise(async(r, e) => {
      const name = await getDetail(id);

      r(name)
    }))
  }

  Promise.all(tasks).then((values) => {

    console.log(values);
  });
}

worker();