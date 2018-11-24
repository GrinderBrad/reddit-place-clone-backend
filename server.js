const express = require('express');
const path = require("path");
const bodyparser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const drawing = require('pngjs-draw');
const png = drawing(require('pngjs').PNG);
const app = express()


app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
 
app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'place.png'));
})

app.post('/', (req, res) => {
    try {
        const { x, y, color } = req.body;
        console.log(req.body);
        if(!x || !y || !color) {
            return res.status(500).send('no required data');
        }   
        fs.createReadStream("place.png")
        .pipe(new png({ filterType: 4 }))
        .on('parsed', function() {
            console.log('black', this.colors.black());
            this.drawPixel(x, y, this.colors.new(color.r, color.g, color.b))
            this.pack().pipe(fs.createWriteStream('place.png'));
        });
        res.status(200).send('update png')
    } catch (err) {
        console.log(err)
        return res.status(500).send('something went wrong');
    }
})
 
app.listen(3000)