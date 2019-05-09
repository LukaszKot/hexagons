var scene;
var camera;
var renderer;
var updateSubscriber = [];
var clock = new THREE.Clock();
var player;
var allies = []
var followedObject;
var team;

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
                player = new Entity(model.container, model, Settings.playerMovingPrecision)
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
        player = new Entity(createSimpleModel(), null, Settings.playerMovingPrecision);
        followedObject = player
        scene.add(player.getElement())
        updateSubscriber.push(player);
        var isRaycasterEnabled = true
    }
    else if (view == "single-ally") {

        var gridObject = new Grid();
        scene.add(gridObject.getPlane())
        Settings.isOrbitControl = false;

        player = new Entity(createSimpleModel(), null, Settings.playerMovingPrecision);
        scene.add(player.getElement())
        updateSubscriber.push(player);
        followedObject = player

        var allies = [new Entity(createSimpleModel(), null, Settings.allyMovingPrecision)];
        scene.add(allies[0].getElement())
        updateSubscriber.push(allies[0])

        team = new Team(player)
        updateSubscriber.push(team)
        var isRaycasterEnabled = true

    }
    else if (view == "multiple-ally") {
        var gridObject = new Grid();
        scene.add(gridObject.getPlane())
        Settings.isOrbitControl = false;

        player = new Entity(createSimpleModel(), null, Settings.playerMovingPrecision);
        scene.add(player.getElement())
        updateSubscriber.push(player);
        followedObject = player
        var allies = [];
        for (var i = 0; i < 3; i++) {
            var theAlly = new Entity(createSimpleModel(), null, Settings.allyMovingPrecision);
            allies.push(theAlly)
            scene.add(theAlly.getElement())
            theAlly.getElement().position.x = Math.random() * 100 - 50
            theAlly.getElement().position.z = Math.random() * 100 - 50
            updateSubscriber.push(theAlly)
        }

        team = new Team(player)
        updateSubscriber.push(team)
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

            for (var i = 0; i < allies.length; i++) {
                var theContainer = allies[i].getEntityMesh()
                var intersects = raycaster.intersectObjects(theContainer.children);
                if (intersects.length > 0) {
                    team.addAlly(allies[i])
                    return;
                }
            }

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