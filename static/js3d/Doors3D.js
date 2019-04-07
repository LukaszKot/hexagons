class Doors3D {
    constructor() {
        var radius = Settings.hexRadius
        var height = Settings.hexHeight
        var wallWidth = Settings.wallWidth;
        var container = new THREE.Object3D()
        var a = 2 * radius / Math.sqrt(3)
        var geometry = new THREE.BoxGeometry(a / 3, height, wallWidth);
        var material = Settings.hexMaterial
        var wall = new THREE.Mesh(geometry, material);

        var side = wall.clone()
        side.position.x = -a / 3;
        container.add(side)
        var nextSide = wall.clone();
        nextSide.position.x = a / 3
        container.add(nextSide)

        return container

    }
}