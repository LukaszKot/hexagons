class Hex3D {
    constructor(doors1, doors2) {
        var radius = Settings.hexRadius
        var height = Settings.hexHeight
        var wallWidth = Settings.wallWidth;
        var container = new THREE.Object3D()
        var a = 2 * radius / Math.sqrt(3)
        var wallGeometry = new THREE.BoxGeometry(a, height, wallWidth);
        var floorGeometry = new THREE.CylinderGeometry(radius * 2 / Math.sqrt(3), radius * 2 / Math.sqrt(3), Settings.floorHeight, 6)
        var material = Settings.hexMaterial
        var wall = new THREE.Mesh(wallGeometry, material);
        var floor = new THREE.Mesh(floorGeometry, material)
        floor.position.y = -height / 2 + Settings.floorHeight / 2
        floor.rotateY(Math.PI / 6)
        container.add(floor)
        var door = new Doors3D();

        for (var i = 0; i < 6; i++) {
            if ((i != 5 - doors1 || doors1 == null) && (i != 5 - doors2 || doors2 == null)) {
                var side = wall.clone()
                side.position.z = radius * Math.cos(Math.PI * 2 / 6 * i);
                side.position.x = radius * Math.sin(Math.PI * 2 / 6 * i);
                side.lookAt(container.position)
                container.add(side)
            }
            else {
                var theDoor = door.clone();
                theDoor.position.z = radius * Math.cos(Math.PI * 2 / 6 * i);
                theDoor.position.x = radius * Math.sin(Math.PI * 2 / 6 * i);
                theDoor.lookAt(container.position)
                container.add(theDoor)
            }

        }
        return container.rotateY(Math.PI + Math.PI / 3)

    }


}
