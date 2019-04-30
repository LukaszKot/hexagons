var Settings = {
    isAxisHelper: true,
    isOrbitControl: true,
    hexRadius: 100,
    hexHeight: 75,
    wallWidth: 10,
    floorHeight: 10,
    hexMaterial: new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0x880000
    }),
    chestMaterial: new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0xcccccc
    }),
    lightMaterial: new THREE.MeshPhongMaterial({
        color: 0x0000bb,
        wireframe: true
    }),
    playerMaterial: new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        wireframe: true
    }),
    raycasterMaterial: new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }),
    playerModelMaterial: new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("textures/player.png"),
        morphTargets: true
    })
}