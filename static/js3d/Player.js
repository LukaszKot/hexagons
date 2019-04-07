class Player {
    constructor(modelContainer, object) {
        this.container = new THREE.Object3D();
        this.player = modelContainer
        this.player.position.set(0, 5, 0)
        this.container.add(this.player);
        this.object = object
    }

    // createPlayerMesh() {
    //     var geometry = new THREE.BoxGeometry(10, 10, 10);
    //     var material = Settings.playerMaterial;
    //     return new THREE.Mesh(geometry, material);
    // }

    getElement() {
        return this.container;
    }

    getPlayerMesh() {
        return this.player;
    }

    move(vector) {
        if (this.object) this.object.setAnimation("2run")
        vector.y = 0;
        this.destination = vector;
        this.directionVect = vector.clone().sub(this.container.position).normalize()
        var angle = Math.atan2(
            this.container.position.clone().x - vector.x,
            this.container.position.clone().z - vector.z,
        )
        this.player.rotation.y = angle
    }

    update() {
        if (this.directionVect) {
            if (this.getDistanceFromTarget() > 2) {
                this.getElement().translateOnAxis(this.directionVect, 2)
                if (this.object) {
                    if (this.getDistanceFromTarget() < 2) {
                        this.object.setAnimation("1stand")
                    }
                }
            }

        }
        camera.position.x = this.getElement().position.x + 100
        camera.position.z = this.getElement().position.z + 200
        camera.position.y = this.getElement().position.y + 200
        camera.lookAt(this.getElement().position)

    }

    getDistanceFromTarget() {
        return this.getElement().position.clone().distanceTo(this.destination);
    }
}