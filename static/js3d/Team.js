class Team {
    constructor(boss) {
        this.boss = boss;
        this.allies = []
    }

    addAlly(ally) {
        this.allies.push(ally)
    }

    update() {
        for (var i = 0; i < this.allies.length; i++) {
            if (i == 0) {
                this.allies[i].move(this.boss.getElement().position)
            }
            else {
                this.allies[i].move(this.allies[i - 1].getElement().position)
            }
        }
    }
}