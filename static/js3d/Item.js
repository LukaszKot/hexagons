class Item {
    constructor() {
        var radius = Settings.hexRadius
        var height = Settings.hexHeight
        var a = 2 * radius / Math.sqrt(3)
        var geometry = new THREE.BoxGeometry(a / 3, height / 2, a / 3);
        var material = Settings.chestMaterial
        var chest = new THREE.Mesh(geometry, material);


        return chest
    }
}