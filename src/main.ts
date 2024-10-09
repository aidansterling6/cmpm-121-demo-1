import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "My amazing game";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const gameSubtitle = "Subtitle";

const subHeader = document.createElement("h2");
subHeader.innerHTML = gameSubtitle;
app.append(subHeader);

let counter: number = 0;
const button = document.createElement("button");
button.innerHTML = `<img src="img/cat.jfif">`;
app.append(button);

const cats = document.createElement("div");
cats.innerHTML = counter + " cats";
app.append(cats);

function incrementScore(){
    counter++;
    cats.innerHTML = counter + " cats";
}
button.onclick = incrementScore;
