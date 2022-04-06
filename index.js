const fetch = require("cross-fetch");
const fs = require('fs');

async function getHtml(url) {

  // const response = await fetch("https://web.thailandsha.com/shaextraplus?province=10&page="+page)
// .then(response => response.text())
// .then(html => {
//   console.log(getDetail(html));
// })
// .catch((error) => {
//   console.error('Error:', error);
// });
// }

  const response = await fetch(url);

  return response.text();

}

function getIdsFromText(text = "") {
  //https://web.thailandsha.com/shalists/detail/65177
  const regexId = /(?<=https:\/\/web.thailandsha.com\/shalists\/detail\/)(.*)(?="\>)/g;
  
  const results = text.match(regexId)
  
  return results;
}


async function getIdsOfPage(page) {
  const html = await getHtml("https://web.thailandsha.com/shaextraplus?province=10&page="+page)

  // console.log(html);

  return getIdsFromText(html);
}


async function worker() {

  let hotelIds = [];

  const tasks = [];
  
  for (let page = 1; page <=43; page++) {

    tasks.push(new Promise(async(r, e) => {
      const ids = await getIdsOfPage(page);

      r(ids)
    }))
  }

  Promise.all(tasks).then((values) => {
    for (let ids of values) {
      hotelIds = hotelIds.concat(ids);
    }
    // console.log(hotelIds)
    save(hotelIds);
  });
}

worker();

function save(ids) {

fs.writeFile('ids.json', JSON.stringify(ids), function (err) {
  if (err) return console.log(err);
  console.log("save ot ids.json file");
});
}