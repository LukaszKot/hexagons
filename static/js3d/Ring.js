class Ring extends THREE.Mesh {
    constructor(position) {
        var geometry = new THREE.RingGeometry(15, 20, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        super(geometry, material)
        this.position.x = position.x
        this.position.y = position.y + 9
        this.position.z = position.z
        this.rotation.x = Math.PI / 2
    }
}