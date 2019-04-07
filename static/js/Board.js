class Board {
    constructor() {
        this.board = $("#main")
        this.hexagons = []
        this.type = "walls"
        this.generateBoard(4)
    }

    generateBoard(n) {
        this.size = n;
        this.board.empty();
        this.hexagons = []
        let id = 0
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                var hexagon = new Hexagon(id, j, i, this)
                this.board.append(hexagon.element);
                this.hexagons.push(hexagon)
                id++;
            }
        }
    }

    serialize() {
        var results = []
        for (var i = 0; i < this.hexagons.length; i++) {
            var hexagon = this.hexagons[i].serialize()
            if (hexagon.dirOut != null)
                results.push(hexagon)
        }
        return results
    }

    subscribe(id, dirIn) {
        this.hexagons[id].subscribe(dirIn)
    }

    unsubscribe(id, dirIn) {
        this.hexagons[id].unsubscribe(dirIn)
    }

    deserialize(json) {
        this.size = parseInt(json.size);
        this.board.empty();
        this.hexagons = []
        let id = 0
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                var hexagon = new Hexagon(id, j, i, this)
                for (var k = 0; k < json.level.length; k++) {
                    var hex = json.level[k]
                    if (hex.id == id) {
                        hexagon.deserialize(hex)
                    }
                }
                this.board.append(hexagon.element);
                this.hexagons.push(hexagon)
                id++;
            }
        }

        this.hexagons.forEach(element => {
            element.setDirIn();
        });
    }

}