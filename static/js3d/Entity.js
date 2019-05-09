class Entity {
    constructor(modelContainer, object, movingPrecision) {
        this.container = new THREE.Object3D();
        this.entity = modelContainer
        this.entity.position.set(0, 5, 0)
        this.container.add(this.entity);
        this.object = object
        this.movingPrecision = movingPrecision;
    }

    getElement() {
        return this.container;
    }

    getEntityMesh() {
        return this.entity;
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
        this.entity.rotation.y = angle
    }

    update() {
        if (this.directionVect) {
            if (this.getDistanceFromTarget() > this.movingPrecision) {
                this.getElement().translateOnAxis(this.directionVect, 2)
                if (this.object) {
                    if (this.getDistanceFromTarget() < this.movingPrecision) {
                        this.object.setAnimation("1stand")
                    }
                }
            }

        }
    }

    getDistanceFromTarget() {
        return this.getElement().position.clone().distanceTo(this.destination);
    }
}