var scene;
var camera;
var renderer;
var updateSubscriber = [];
var clock = new THREE.Clock();
var player;
var allies = []
var followedObject;

$(document).ready(function () {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        45,
        $(window).width() / $(window).height(),
        0.1,
        10000
    );
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);
    renderer.setSize($(window).width(), $(window).height());
    $("#root").append(renderer.domElement);
    camera.position.set(200, 200, 200)
    camera.lookAt(scene.position)
    if (Settings.isAxisHelper) {
        var axes = new THREE.AxesHelper(1000)
        scene.add(axes)
    }

    if (view == "hex") {
        var gridObject = new Grid();
        scene.add(gridObject.getPlane())
        var hex = new Hex3D(0, 5);
        hex.position.y += Settings.hexHeight / 2
        var light = new Light(hex.position.x, hex.position.y + 50, hex.position.z)
        scene.add(light.getElement())
        scene.add(hex);
    }
    else if (view == "game") {
        Settings.isOrbitControl = false;
        camera.position.set(0, 1000, 1000)
        camera.lookAt(scene.position)
        var gridObject = new Grid();
        scene.add(gridObject.getPlane())
        var model = new Model()
        var level = new Level3D(0);
        level.getContainer().position.y -= Settings.floorHeight - 0.3
        model.loadModel("models/player.json", Settings.playerModelMaterial, "player")
            .then(() => {
                player = new Entity(model.container, model)
                scene.add(player.getElement())
                updateSubscriber.push(model)
                updateSubscriber.push(player)
                model.setAnimation("1stand")
                followedObject = player
            })
        scene.add(level.getContainer())
        var isRaycasterEnabled = true
        var ui = new Ui(level);
    }
    else if (view == "player") {

        function createSimpleModel() {
            var container = new THREE.Object3D();
            var geometry = new THREE.BoxGeometry(10, 10, 10);
            var material = Settings.playerMaterial;
            var box = new THREE.Mesh(geometry, material);
            container.add(box);
            var axis = new THREE.AxesHelper(10)
            axis.rotation.y = Math.PI
            container.add(axis)
            return container;
        }
        var gridObject = new Grid();
        scene.add(gridObject.getPlane())
        Settings.isOrbitControl = false;
        player = new Entity(createSimpleModel());
        followedObject = player
        scene.add(player.getElement())
        updateSubscriber.push(player);
        var isRaycasterEnabled = true
    }
    else if (view == "single-ally") {
        function createSimpleModel() {
            var container = new THREE.Object3D();
            var geometry = new THREE.BoxGeometry(10, 10, 10);
            var material = Settings.playerMaterial;
            var box = new THREE.Mesh(geometry, material);
            container.add(box);
            var axis = new THREE.AxesHelper(10)
            axis.rotation.y = Math.PI
            container.add(axis)
            return container;
        }
        var gridObject = new Grid();
        scene.add(gridObject.getPlane())
        Settings.isOrbitControl = false;

        player = new Entity(createSimpleModel());
        scene.add(player.getElement())
        updateSubscriber.push(player);
        followedObject = player

        allies.push(new Entity(createSimpleModel()));
        scene.add(allies[0].getElement())
        updateSubscriber.push(allies[0]);

        var isRaycasterEnabled = true


    }

    if (Settings.isOrbitControl) {
        var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControl.addEventListener('change', function () {
            renderer.render(scene, camera)
        });
    }

    if (isRaycasterEnabled) {
        var raycaster = new THREE.Raycaster();
        var mouseVector = new THREE.Vector2();
        var clickedVect = null;
        var geometry = new THREE.SphereGeometry(3);
        var material = Settings.raycasterMaterial
        var sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere)
        $("#root").mousedown((event) => {
            mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, camera);
            var intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0) {
                clickedVect = intersects[0].point
                var vector = clickedVect.clone();
                player.move(vector)
                sphere.position.set(clickedVect.x, 0, clickedVect.z)
            }
        })
    }


    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        var delta = clock.getDelta();
        for (var i = 0; i < updateSubscriber.length; i++) {
            updateSubscriber[i].update(delta);
        }
        if (followedObject != null) {
            var position = followedObject.getElement().position;
            camera.position.set(position.x + 100, position.y + 200, position.z + 200)
            camera.lookAt(position)
        }

    }
    render();

})