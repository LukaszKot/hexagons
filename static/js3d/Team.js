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
                if (this.boss.getElement().position.distanceTo(this.allies[i].getElement().position) > 50
                    && this.allies[i].isMoving == false) {
                    this.allies[i].object.setAnimation(this.allies[i].runningAnimation)
                    this.allies[i].isMoving = true;
                }
                this.allies[i].move(this.boss.getElement().position)
            }
            else {
                if (this.allies[i - 1].getElement().position.distanceTo(this.allies[i].getElement().position) > 50
                    && this.allies[i].isMoving == false) {
                    this.allies[i].object.setAnimation(this.allies[i].runningAnimation)
                    this.allies[i].isMoving = true;
                }

                this.allies[i].move(this.allies[i - 1].getElement().position)
            }
        }
    }
}