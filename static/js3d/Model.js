class Model {

    constructor() {
        this.container = new THREE.Object3D()
        this.mixer = null
    }

    loadModel = (urlModel, texture, name) => {
        return new Promise((resolve, reject) => {
            var loader = new THREE.JSONLoader();

            loader.load(urlModel, (geometry) => {
                var meshModel = new THREE.Mesh(geometry, texture)
                meshModel.name = name

                var box = new THREE.Box3().setFromObject(meshModel);

                meshModel.position.y = box.getSize().y / 2 + Settings.floorHeight
                meshModel.rotation.y = -Math.PI / 2
                this.meshModel = meshModel;
                this.mixer = new THREE.AnimationMixer(this.meshModel)
                console.log(this.meshModel.geometry.animations)
                this.container.add(meshModel)
                resolve(meshModel);
            });
        })

    }


    update(delta) {
        if (this.mixer) this.mixer.update(delta)
    }


    setAnimation(name) {
        this.mixer.uncacheRoot(this.meshModel)
        this.mixer.clipAction(name).play();
    }


}
