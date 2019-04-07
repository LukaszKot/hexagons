class Level3D {
    constructor(id) {
        this.levelId = id
        this.radius = Settings.hexRadius
        this.hexHeight = Settings.hexHeight;
        this.container = new THREE.Object3D()
        this.net = new Net();
        this.lights = []
        this.getData(0)
            .then((result) => {
                this.data = result;
                this.makeLevel();
            })
    }

    getData(id) {
        return this.net.getLevel(this.levelId);
    }

    makeLevel() {
        var theLevel = this.data.level;
        for (var i = 0; i < theLevel.length; i++) {
            var hexData = theLevel[i]
            var hex = new Hex3D(hexData.dirIn == "" ? null : hexData.dirIn, hexData.dirOut == "" ? null : hexData.dirOut)

            var z = this.radius * 2 * hexData.z;
            var x = this.radius * 2 * hexData.x - hexData.x * ((this.radius / 4) + 2)
            if (hexData.x % 2 == 1) {
                z += this.radius
            }
            hex.position.set(x, this.hexHeight / 2, z)
            this.container.add(hex);
            if (hexData.type == "treasure") {
                var item = new Item();
                item.position.set(x, this.hexHeight / 3 * 2, z)
                this.container.add(item)
            }
            if (hexData.type == "light") {
                var light = new Light(x, this.hexHeight / 3 * 6, z)
                this.container.add(light.getElement())
                this.lights.push(light)
            }
        }
    }

    getContainer() {
        return this.container;
    }

    load(index) {
        this.levelId = index
        for (var i = this.container.children.length - 1; i >= 0; i--) {
            this.container.remove(this.container.children[i]);
        }
        this.getData(index)
            .then((result) => {
                this.data = result;
                this.makeLevel();
            })
    }

    changeLightsIntensity(intensity) {
        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].changeIntensity(intensity)
        }
    }

    changeLightsHeight(height) {
        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].changeHeight(height)
        }
    }
}