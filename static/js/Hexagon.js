class Hexagon {
    constructor(id, x, z, parent) {
        this.id = id
        this.x = x
        this.z = z
        this.dirOut = null
        this.dirIn = []
        this.type = "walls"
        this.parent = parent;
        this.generateElement();
    }

    generateElement() {
        var offsetZ = this.x % 2 != 0 ? 100 : 0
        var div = $("<div>")
            .addClass("hexagon")
            .css("left", (this.x * 165) + "px")
            .css("top", (this.z * 200 + offsetZ) + "px")
            .attr("id", "el" + this.id)
            .on("click", this.click)
        this.element = div
    }

    click = () => {
        this.setType();
        this.setDirOut();
        this.setDirIn();
    }

    setType() {
        this.type = this.parent.type
    }

    setDirOut() {
        if (this.dirOut == null) {
            this.dirOut = 0;
            this.element.append($("<div>").addClass("arrow").html(this.dirOut))
        }
        else if (this.dirOut < 5) {
            this.dirOut++;
            this.element.children(".arrow")
                .html(this.dirOut)
                .css("transform", "rotate(" + (this.dirOut * 60) + "deg)")
        }
        else {
            this.dirOut = null;
            this.element.empty();
        }
    }

    setDirIn() {
        var oldDirOut = this.getOldDirOut();
        if (oldDirOut != null) {
            var oldId = this.getIdFromDirOut(oldDirOut)
            if (oldId != null) {
                var oldDirIn = this.getDirInFromDirOut(oldDirOut)
                this.parent.unsubscribe(oldId, oldDirIn)
            }

        }
        var id = this.getIdFromDirOut(this.dirOut)
        var dirIn = this.getDirInFromDirOut(this.dirOut)
        if (id != null && dirIn != null)
            this.parent.subscribe(id, dirIn)
    }

    getOldDirOut() {
        if (this.dirOut == null) {
            return 5;
        }
        if (this.dirOut - 1 >= 0) return this.dirOut - 1
        else return null
    }

    getDirInFromDirOut(dirOut) {
        if (dirOut == null) return null;
        var dirIn = dirOut + 3
        dirIn = dirIn > 5 ? dirIn - 6 : dirIn
        return dirIn
    }

    getIdFromDirOut(dirOut) {
        if (dirOut == null) return null;
        var id = null;
        var n = this.parent.size
        if (dirOut == 0) {
            id = this.id - n;
        }
        else if (dirOut == 3) {
            id = this.id + n
        }
        else {
            if (this.x % 2 == 0) {
                if (dirOut == 1) {
                    if (this.x + 1 >= n) return null;
                    id = this.id - n + 1
                }
                else if (dirOut == 2) {
                    if (this.x + 1 >= n) return null;
                    id = this.id + 1
                }
                else if (dirOut == 4) {
                    if (this.x - 1 < 0) return null;
                    id = this.id - 1
                }

                else if (dirOut == 5) {
                    if (this.x - 1 < 0) return null;
                    id = this.id - n - 1
                }
            }
            else {
                if (dirOut == 1) {
                    if (this.x + 1 >= n) return null;
                    id = this.id + 1
                }
                else if (dirOut == 2) {
                    if (this.x + 1 >= n) return null;
                    id = this.id + n + 1
                }
                else if (dirOut == 4) {
                    if (this.x - 1 < 0) return null;
                    id = this.id + n - 1
                }
                else if (dirOut == 5) {
                    if (this.x - 1 < 0) return null;
                    id = this.id - 1
                }

            }
        }
        if (id < 0) return null;
        if (id >= n * n) return null;
        return id;
    }

    serialize() {
        return {
            id: this.id,
            x: this.x,
            z: this.z,
            dirOut: this.dirOut,
            dirIn: this.dirIn.length > 0 ? this.dirIn[0] : null,
            type: this.type
        }
    }

    deserialize(json) {
        this.id = parseInt(json.id)
        this.x = parseInt(json.x)
        this.z = parseInt(json.z)
        this.dirOut = json.dirOut == '' ? null : parseInt(json.dirOut)
        this.dirIn = json.dirIn == '' ? [] : [parseInt(json.dirIn)]
        this.type = json.type

        if (this.dirOut != null) {
            this.element.append($("<div>")
                .addClass("arrow")
                .html(this.dirOut)
                .css("transform", "rotate(" + (this.dirOut * 60) + "deg)")
            )
        }
    }

    subscribe(dirIn) {
        if (!this.dirIn.includes(dirIn)) {
            this.dirIn.push(dirIn)
        }
    }

    unsubscribe(dirIn) {
        if (this.dirIn.includes(dirIn)) {
            this.dirIn.splice(this.dirIn.indexOf(dirIn), 1);
        }
    }
}