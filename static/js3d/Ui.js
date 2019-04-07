class Ui {
    constructor(levelObject) {
        this.level = $("#level");
        this.height = $("#height");
        this.power = $("#power")
        this.levelObject = levelObject
        this.net = new Net();
        this.addLevelListiners();
        this.addPowerListiners();
        this.addHeightListiners();
        this.currentId = 0;
    }

    addLevelListiners() {
        this.net.getLevelsList()
            .then((result) => {
                for (var i = 0; i < result.length; i++) {
                    var option = $("<option>").html(result[i])
                    this.level.append(option)
                }
            })

        this.level.on("input", () => {
            var id = this.level.val();
            if (id == this.currentId) return;
            else this.currentId = id
            this.levelObject.load(id)
        })
    }

    addPowerListiners() {
        this.power.on("input", () => {
            this.levelObject.changeLightsIntensity(this.power.val())
        })
    }

    addHeightListiners() {
        this.height.on("input", () => {
            this.levelObject.changeLightsHeight(this.height.val())
        })
    }
}