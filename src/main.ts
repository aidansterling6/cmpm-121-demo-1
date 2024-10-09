import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

class Element {
  element;
  constructor(type: string) {
    this.element = document.createElement(type);
    app.append(this.element);
  }
}

class Game {
  name: string = "My amazing game";
  subtitle: string = "by Aidan";
  score: number = 0;
  counterGrowthRate: number = 1;
  lastTime: number | undefined;

  header;
  subHeader;
  catButton;
  cats;
  upgradeButton;

  constructor() {
    document.title = this.name;
    this.header = new Element("h1");
    this.header.element.innerHTML = this.name;

    this.subHeader = new Element("h2");
    this.subHeader.element.innerHTML = this.subtitle;

    this.catButton = new Element("button");
    this.catButton.element.innerHTML = "<span>&#128568;</span>";
    this.catButton.element.style.fontSize = "50px";
    this.catButton.element.onclick = this.incrementScore;

    this.cats = new Element("div");

    this.upgradeButton = new Element("button");
    this.upgradeButton.element.innerHTML = "Upgrade (cost 10)";
    this.upgradeButton.element.onclick = this.incrementGrowthRate;
    requestAnimationFrame(this.incrementScoreOverTime);
  }
  setScore = (num: number) => {
    this.score = num;
    this.hideShowUpgradeButton();
    this.cats.element.innerHTML = this.score.toFixed(4) + " cats";
  };
  incrementScore = () => {
    this.setScore(this.score + 1);
  };
  incrementScoreOverTime = (time: number) => {
    if (this.lastTime !== undefined) {
      this.setScore(
        this.score + (time - this.lastTime) * (this.counterGrowthRate / 1000.0),
      );
    }
    this.lastTime = time;
    requestAnimationFrame(this.incrementScoreOverTime);
  };
  hideShowUpgradeButton = () => {
    if (this.score >= 10) {
      this.upgradeButton.element.style.display = "inline-block";
    } else {
      this.upgradeButton.element.style.display = "none";
    }
  };
  incrementGrowthRate = () => {
    this.counterGrowthRate++;
    this.setScore(this.score - 10);
  };
}

new Game();
