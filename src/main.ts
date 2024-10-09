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
function setScore(num: number){
    counter = num;
    hideShowUpgradeButton();
    cats.innerHTML = counter.toFixed(4) + " cats";
}
let counterGrowthRate = 1;
const button = document.createElement("button");
button.innerHTML = `<img src="img/cat.jfif">`;
app.append(button);

const cats = document.createElement("div");
app.append(cats);

function incrementScore() {
    setScore(counter + 1);
}
button.onclick = incrementScore;

let lastTime: number | undefined;
function incrementScoreOverTime(time: number) {
  if (lastTime !== undefined) {
    setScore(counter + (time - lastTime) * (counterGrowthRate / 1000.0));
  }
  lastTime = time;
  requestAnimationFrame(incrementScoreOverTime);
}
requestAnimationFrame(incrementScoreOverTime);

const upgradeButton = document.createElement("button");
upgradeButton.innerHTML = "Upgrade (cost 10)"
app.append(upgradeButton);

function hideShowUpgradeButton(){
    if(counter >= 10){
        upgradeButton.style.display = 'inline-block';
    }
    else{
        upgradeButton.style.display = 'none';
    }
}


function incrementGrowthRate() {
    counterGrowthRate++;
    setScore(counter - 10);
  }
upgradeButton.onclick = incrementGrowthRate;