class Menu {
    constructor(board, net) {
        this.genererateSelect();
        this.submit = $("#submit").on("click", this.submitClick)
        this.jsonDisplay = $("#json")
        this.board = board
        this.net = net
        this.generateTypes();
        this.hexagonListiner();
        this.updateJsonDisplay();
        this.readSelect = $("#read-select")
        this.readButton = $("#read-button")
        this.net.getLevelsList()
            .then(result => {
                result.push("NOWY")
                this.renderLevelList(result);
            })
        this.readButtonClickListiner();
    }

    genererateSelect() {
        this.select = $("#select")
        for (var i = 1; i <= 10; i++) {
            var options = $("<option>").html(i)
            if (i == 4) options.attr("selected", "selected")
            this.select.append(options)
        }
        this.select.on("input", (e) => {
            var n = parseInt($(e.currentTarget).val());
            this.board.generateBoard(n)
            this.updateJsonDisplay();
            this.hexagonListiner();
        })
    }

    submitClick = () => {
        var json = this.getJson();
        console.log(json)
        if (json.level.length == 0) return;
        if (this.readSelect.val() == "NOWY") {
            this.net
                .addLevel(json)
                .then(() => {
                    this.board.generateBoard(this.select.val())
                    return this.net.getLevelsList()
                })
                .then((result) => {
                    result.push("NOWY")
                    this.renderLevelList(result)
                    this.updateJsonDisplay();
                    this.hexagonListiner();
                })

        }
        else {
            this.net
                .updateLevel(this.readSelect.val(), json)
                .then(() => {
                    this.board.generateBoard(this.select.val())
                    return this.net.getLevelsList()
                })
                .then((result) => {
                    result.push("NOWY")
                    this.renderLevelList(result)
                    this.updateJsonDisplay();
                    this.hexagonListiner();
                })
        }
    }
    readButtonClickListiner() {
        this.readButton.on("click", () => {
            var val = this.readSelect.val();
            if (val == "NOWY") return;
            this.net.getLevel(val)
                .then(result => {
                    this.board.deserialize(result)
                    this.select.val(result.size)
                    this.updateJsonDisplay();
                    this.hexagonListiner();
                })
        })
    }

    getJson() {
        var json = {
            size: this.board.size,
            level: this.board.serialize()
        }
        return json
    }

    generateTypes() {
        this.typesNames = ['walls', 'enemy', 'treasure', 'light', 'ally']
        for (var i = 0; i < this.typesNames.length; i++) {
            var div = $('<div>')
                .addClass('buttons-style')
                .addClass('type')
                .html(this.typesNames[i].toUpperCase())
                .on("click", this.setType(i))
            $("#types").append(div)
            if (i == 0) {
                div.css("border-color", "green")
            }
        }
    }

    setType = (i) => {
        return (e) => {
            this.board.type = this.typesNames[i]
            $(".type").css("border-color", "#888888")
            $(e.currentTarget).css("border-color", "green")
        }
    }

    updateJsonDisplay() {
        var json = this.getJson();
        this.jsonDisplay.html(JSON.stringify(json, null, "\t"))
    }

    hexagonListiner() {
        $('.hexagon').on('click', () => {
            this.updateJsonDisplay();
        })
    }

    renderLevelList(levels = ['NOWY']) {
        this.readSelect.empty();
        for (var i = 0; i < levels.length; i++) {
            var option = $("<option>").html(levels[i])
            if (levels[i] == 'NOWY')
                option.attr('selected', 'selected')
            this.readSelect.append(option)
        }
    }
}