class Entity {
    constructor(modelContainer, object, movingPrecision, standingAnimation = "1stand", runningAnimation = "2run") {
        this.container = new THREE.Object3D();
        this.entity = modelContainer
        this.entity.position.set(0, 5, 0)
        this.container.add(this.entity);
        this.object = object
        this.movingPrecision = movingPrecision;
        this.standingAnimation = standingAnimation;
        this.runningAnimation = runningAnimation;
    }

    getElement() {
        return this.container;
    }

    getEntityMesh() {
        return this.entity;
    }

    move(vector) {
        if (this.object) this.object.setAnimation(this.runningAnimation)
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
                        this.object.setAnimation(this.standingAnimation)
                    }
                }
            }

        }
    }

    getDistanceFromTarget() {
        return this.getElement().position.clone().distanceTo(this.destination);
    }

    clone() {
        var newModel = this.object.clone();
        return new Entity(newModel.container, newModel, this.movingPrecision, "Stand", "run")
    }
}