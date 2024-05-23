const fs = require("fs");
const path = require("path");
const { scrapper } = require("./src/scrapper");

const html = fs.readFileSync("./files/van-gogh-paintings.html", "utf8");
const data = scrapper(html);

fs.writeFile(
  path.join(__dirname, "output", `output_${new Date().toJSON()}.json`),
  data,
  (err) => {
    if (err) throw err;
    console.log("Data has been written to output.json successfully");
  }
);
