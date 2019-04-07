class Grid {
    constructor() {
        var geometry = new THREE.PlaneGeometry(2000, 2000, 10, 10);
        var material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, side: THREE.DoubleSide });
        this.plane = new THREE.Mesh(geometry, material);
        this.plane.rotateX(Math.PI / 2)

    }
    getPlane() {
        return this.plane
    }
}