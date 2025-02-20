const fs = require("fs");
const http = require("http");
const { json } = require("stream/consumers");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
//______________________________________________________________________________________________________________________-
//  reading file
// reading and writing file synchronously

// const textIn = fs.readFileSync("./txt/input.txt", "utf8");
// console.log(textIn);

// const textout = `mansy loves avocado ${textIn}.\n created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textout);
// console.log("finished writing");

// reading and writing file asynchronously
// console.log("start reading");
// fs.readFile("./txt/start.txt", "utf8", (err, data) => {
//   if (err) return console.log("ERROR❌");
//   fs.readFile(`./txt/${data}.txt`, "utf8", (err, data2) => {
//     console.log(data2);

//     fs.readFile("./txt/append.txt", "utf8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf8", (err) => {
//         console.log("your file has been written");
//       });
//     });
//   });
// });
// console.log("will read the file");
//____________________________________________________________________________________________________________________
//server

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const dataobj = JSON.parse(data);
const server = http.createServer((req, res) => {
  const path = req.url;
  //console.log(path);
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const cardsHTML = dataobj
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);
    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const product = dataobj[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "content-type": " text/html",
    });
    res.end("<h1>page not found !</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to request on port 8000");
});
