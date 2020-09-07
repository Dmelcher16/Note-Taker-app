
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + ".html");
});


app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/notes.html"));
});



app.get("/api/notes", function(req, res) {
    fs.readFile(__dirname + "/db/db.json", "utf8", function(err, data) {
        res.send(JSON.parse(data))
    });
});


app.post("/api/notes", function(req, res) {
    const note = {
        id: uuidv4(),
        ...req.body,
    };

    fs.readFile(__dirname + "/db/db.json", "utf8", function(err, data) {
        const notes = JSON.parse(data);
        notes.push(note);
        const stringifiedData = JSON.stringify(notes, null, 2);
        fs.writeFile(__dirname + "/db/db.json", stringifiedData, function() {
            res.json(note);
        });
    });
});

app.delete("/api/notes/:id", async function(req, res) {
    try {
        const { id } = req.params;
        const data = await fs.promises.readFile(__dirname + "/db/db.json", "utf8");
        let notes = JSON.parse(data);
        notes = notes.filter((note) => note.id !== id);
        const stringifiedData = JSON.stringify(notes, null, 2);
        await fs.promises.writeFile(__dirname + "/db/db.json", stringifiedData);
        res.json(true);
    } catch (err) { res.status(500).end() };
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);