import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

interface Item {
  name: string;
  desc: string;
  cost: number;
  rate: number;
}
const availableItems: Item[] = [
  { name: "Milk", desc: "Cats like milk (kinda)", cost: 10, rate: 0.1 },
  {
    name: "Newspaper",
    desc: "Attract cats by giving them newspaper to shred",
    cost: 100,
    rate: 2,
  },
  {
    name: "Cardboard box",
    desc: "Provides houses for your cats",
    cost: 1000,
    rate: 50,
  },
  { name: "Catnip", desc: "Give the cats drugs", cost: 10000, rate: 500 },
  {
    name: "Catnip factory",
    desc: "All cats nearby will want some",
    cost: 100000,
    rate: 50000,
  },
];

class Element {
  element;
  constructor(type: string) {
    this.element = document.createElement(type);
    app.append(this.element);
  }
}

class Upgrade {
  cost;
  bonus;
  text;
  desc;
  game;
  upgradeButton;
  constructor(
    cost: number,
    bonus: number,
    text: string,
    desc: string,
    game: Game,
  ) {
    this.cost = cost;
    this.bonus = bonus;
    this.text = text;
    this.desc = desc;
    this.game = game;
    this.upgradeButton = new Element("button");
    this.upgradeButton.element.innerHTML =
      this.text +
      " (cost: " +
      this.cost.toFixed(2) +
      ", bonus: " +
      this.bonus.toFixed(2) +
      ")";
    this.upgradeButton.element.onclick = () => {
      this.game.counterGrowthRate += this.bonus;
      this.game.setScore(this.game.score - this.cost);
      this.game.catGrowth.element.innerHTML =
        this.game.counterGrowthRate.toFixed(1) + " cats/sec";
      this.cost *= 1.15;
      this.upgradeButton.element.innerHTML =
        this.text +
        " (cost: " +
        this.cost.toFixed(2) +
        ", bonus: " +
        this.bonus.toFixed(2) +
        ")";
    };
    document.onmousemove = (event) => {
      this.game.description.element.style.left = event.pageX + 15 + "px";
      this.game.description.element.style.bottom =
        Number(window.innerHeight) - event.pageY - 13 + "px";
    };
    this.upgradeButton.element.onmouseover = () => {
      this.game.description.element.style.display = "inline-block";
      this.game.description.element.innerHTML = this.desc;
    };
    this.upgradeButton.element.onmouseout = () => {
      this.game.description.element.style.display = "none";
    };
  }
  updatevisability() {
    if (this.game.score >= this.cost) {
      this.upgradeButton.element.style.display = "inline-block";
    } else {
      this.upgradeButton.element.style.display = "none";
    }
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
  catGrowth;
  upgradeButtons: Upgrade[] = [];
  description;

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
    this.catGrowth = new Element("div");
    this.catGrowth.element.innerHTML =
      this.counterGrowthRate.toFixed(1) + " cats/sec";

    //this.upgradeButton = new Element("button");
    //this.upgradeButton.element.innerHTML = "Upgrade (cost 10)";
    //this.upgradeButton.element.onclick = this.incrementGrowthRate;
    //requestAnimationFrame(this.incrementScoreOverTime);
    for (const Item of availableItems) {
      this.upgradeButtons.push(
        new Upgrade(Item.cost, Item.rate, Item.name, Item.desc, this),
      );
    }

    this.description = new Element("div");
    this.description.element.innerHTML = "Testing";
    this.description.element.style.position = "absolute";
    this.description.element.style.display = "none";
    //this.upgradeButtons.push(new Upgrade(10, 0.1, "Milk", this));
    //this.upgradeButtons.push(new Upgrade(100, 2, "Cardboard box", this));
    //this.upgradeButtons.push(new Upgrade(1000, 50, "Catnip", this));
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
    for (const upgradeButton of this.upgradeButtons) {
      upgradeButton.updatevisability();
    }
    // if (this.score >= 10) {
    //   this.upgradeButton.element.style.display = "inline-block";
    // } else {
    //   this.upgradeButton.element.style.display = "none";
    // }
  };
  // incrementGrowthRate = (num: number) => {
  //   this.counterGrowthRate += num;
  //   this.setScore(this.score - 10);
  // };
}

new Game();
