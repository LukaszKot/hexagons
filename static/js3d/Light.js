class Light {
    constructor(x, y, z) {
        this.container = new THREE.Object3D();
        this.light = new THREE.SpotLight(0xaaaa00, 1, 500, 3.14);
        var geometry = new THREE.SphereGeometry(5);
        var material = Settings.lightMaterial
        this.sphere = new THREE.Mesh(geometry, material);
        this.container.position.set(0, 0, 0);
        this.sphere.position.set(0, 0, 0);
        this.container.position.set(x, y, z)
        this.container.add(this.light)
        this.container.add(this.sphere)

    }

    getElement() {
        return this.container
    }

    changeIntensity(intensity) {
        this.light.intensity = intensity
    }

    changeHeight(height) {
        this.container.position.y = height
    }
}