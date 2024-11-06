import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

interface Item {
  name: string;
  desc: string;
  cost: number;
  rate: number;
}

interface CSSPropertyData {
  propertyPath: string[];
  value: string | (() => void);
}

class Element {
  element: any;
  constructor(type: string, CSSproperties: CSSPropertyData[] | null = null) {
    this.element = document.createElement(type);
    app.append(this.element);
    if (CSSproperties !== null) {
      for (let i = 0; i < CSSproperties.length; i++) {
        if (CSSproperties[i].propertyPath.length === 1) {
          this.element[CSSproperties[i].propertyPath[0]] =
            CSSproperties[i].value;
        } else if (CSSproperties[i].propertyPath.length === 2) {
          this.element[CSSproperties[i].propertyPath[0]][
            CSSproperties[i].propertyPath[1]
          ] = CSSproperties[i].value;
        } else if (CSSproperties[i].propertyPath.length === 3) {
          this.element[CSSproperties[i].propertyPath[0]][
            CSSproperties[i].propertyPath[1]
          ][CSSproperties[i].propertyPath[2]] = CSSproperties[i].value;
        }
      }
    }
  }
}

class Upgrade {
  cost;
  bonus;
  text;
  desc;
  game;
  upgradeButton;
  constructor(game: Game, item: Item) {
    this.cost = item.cost;
    this.bonus = item.rate;
    this.text = item.name;
    this.desc = item.desc;
    this.game = game;
    this.upgradeButton = new Element("button", [
      {
        propertyPath: ["innerHTML"],
        value:
          this.text +
          " (cost: " +
          this.cost.toFixed(2) +
          ", bonus: " +
          this.bonus.toFixed(2) +
          ")",
      },
    ]);
    this.game.upgradeButtons.push(this);
    this.upgradeButton.element.onclick = () => {
      this.game.counterGrowthRate += this.bonus;
      this.game.setScore(this.game.score - this.cost);
      if (this.game.HTMLElements.catGrowth instanceof Element) {
        this.game.HTMLElements.catGrowth.element.innerHTML =
          this.game.counterGrowthRate.toFixed(1) + " cats/sec";
      }
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
      if (this.game.HTMLElements.description instanceof Element) {
        this.game.HTMLElements.description.element.style.left =
          event.pageX + 15 + "px";
        this.game.HTMLElements.description.element.style.bottom =
          Number(window.innerHeight) - event.pageY - 13 + "px";
      }
    };
    this.upgradeButton.element.onmouseover = () => {
      if (this.game.HTMLElements.description instanceof Element) {
        this.game.HTMLElements.description.element.style.display =
          "inline-block";
        this.game.HTMLElements.description.element.innerHTML = this.desc;
      }
    };
    this.upgradeButton.element.onmouseout = () => {
      if (this.game.HTMLElements.description instanceof Element) {
        this.game.HTMLElements.description.element.style.display = "none";
      }
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

  upgradeButtons: Upgrade[] = [];

  HTMLElements: { [id: string]: Element | Upgrade };

  constructor() {
    document.title = this.name;

    this.HTMLElements = {
      header: new Element("h1", [
        { propertyPath: ["innerHTML"], value: this.name },
      ]),
      subHeader: new Element("h2", [
        { propertyPath: ["innerHTML"], value: this.subtitle },
      ]),
      catButton: new Element("button", [
        { propertyPath: ["id"], value: "mainButton" },
        { propertyPath: ["innerHTML"], value: "<span>&#128568;</span>" },
        { propertyPath: ["style", "fontSize"], value: "50px" },
        { propertyPath: ["onclick"], value: this.incrementScore },
        { propertyPath: ["border-style"], value: "solid" },
        { propertyPath: ["border-color"], value: "black" },
        { propertyPath: ["border-width"], value: "20px" },
      ]),
      cats: new Element("div"),
      catGrowth: new Element("div", [
        {
          propertyPath: ["innerHTML"],
          value: this.counterGrowthRate.toFixed(1) + " cats/sec",
        },
      ]),
      milk: new Upgrade(this, {
        name: "Milk",
        desc: "Cats like milk (kinda)",
        cost: 10,
        rate: 0.1,
      }),
      newspaper: new Upgrade(this, {
        name: "Newspaper",
        desc: "Attract cats by giving them newspaper to shred",
        cost: 100,
        rate: 2,
      }),
      cardboardBox: new Upgrade(this, {
        name: "Cardboard box",
        desc: "Provides houses for your cats",
        cost: 1000,
        rate: 50,
      }),
      catnip: new Upgrade(this, {
        name: "Catnip",
        desc: "Give the cats drugs",
        cost: 10000,
        rate: 500,
      }),
      catnipFactory: new Upgrade(this, {
        name: "Catnip factory",
        desc: "All cats nearby will want some",
        cost: 100000,
        rate: 50000,
      }),
      description: new Element("div", [
        { propertyPath: ["innerHTML"], value: "Testing" },
        { propertyPath: ["style", "position"], value: "absolute" },
        { propertyPath: ["style", "display"], value: "none" },
      ]),
    };

    requestAnimationFrame(this.incrementScoreOverTime);
    requestAnimationFrame(this.animate);
  }

  setScore = (num: number) => {
    this.score = num;
    this.hideShowUpgradeButton();
    if (this.HTMLElements.cats instanceof Element) {
      this.HTMLElements.cats.element.innerHTML =
        this.score.toFixed(4) + " cats";
    }
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

  animate = (time: number) => {
    if (this.HTMLElements.catButton instanceof Element) {
      let loopingDecimal =
        (time / (1000 / Math.sqrt(Math.sqrt(this.counterGrowthRate)))) % 1;
      if (loopingDecimal > 0.5) {
        loopingDecimal = 1 - loopingDecimal;
      }
      loopingDecimal = (loopingDecimal - 0.25) * 20;
      this.HTMLElements.catButton.element.style.rotate =
        "" + loopingDecimal + "deg";
    }
    requestAnimationFrame(this.animate);
  };

  hideShowUpgradeButton = () => {
    for (const upgradeButton of this.upgradeButtons) {
      upgradeButton.updatevisability();
    }
  };
}

new Game();
