class Net {
    constructor() {
    }

    addLevel(json) {
        return this.sendData("/levels", "POST", json)
    }

    getLevelsList() {
        return this.sendData("/levels", "GET")
    }

    getLevel(index) {
        return this.sendData("/levels/" + index, "GET")
    }

    updateLevel(index, json) {
        return this.sendData("/levels/" + index, "PUT", json)
    }

    sendData(url, method, body) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                data: body,
                type: method,
                success: function (data) {
                    resolve(data)
                },
                error: function (xhr, status, error) {
                    reject(error)
                },
            });
        })

    }

}