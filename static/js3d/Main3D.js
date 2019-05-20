var scene;
var camera;
var renderer;
var updateSubscriber = [];
var clock = new THREE.Clock();
var player;
var allies = []
var followedObject;
var team;
var mousePosition = null
var raycaster = new THREE.Raycaster();
var hex;
var firstTime = true;

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
        var level = new Level3D(0, updateSubscriber, allies);
        level.getContainer().position.y -= Settings.floorHeight - 0.3
        model.loadModel("models/player.json", Settings.playerModelMaterial, "player")
            .then(() => {
                player = new Entity(model.container, model, Settings.playerMovingPrecision)
                scene.add(player.getElement())
                updateSubscriber.push(model)
                updateSubscriber.push(player)
                model.setAnimation("1stand")
                followedObject = player
                team = new Team(player)
                updateSubscriber.push(team)
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

        allies.push(new Entity(createSimpleModel(), null, Settings.allyMovingPrecision))
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
    else if (view == "colision") {
        var gridObject = new Grid();
        scene.add(gridObject.getPlane())
        gridObject.getPlane().position.y -= 0.1
        Settings.isOrbitControl = false;

        player = new Entity(createSimpleModel(), null, Settings.playerMovingPrecision)
        scene.add(player.getElement())
        updateSubscriber.push(player)
        followedObject = player;
        var isRaycasterEnabled = true
        hex = new Hex3D(2, 3);
        hex.position.y = Settings.hexHeight / 2 - Settings.floorHeight;
        scene.add(hex)
        var light = new Light(hex.position.x, hex.position.y + 50, hex.position.z)
        scene.add(light.getElement())
        light.changeIntensity(3)
    }

    if (Settings.isOrbitControl) {
        var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControl.addEventListener('change', function () {
            renderer.render(scene, camera)
        });
    }

    if (isRaycasterEnabled) {
        var mouseVector = new THREE.Vector2();
        var clickedVect = null;
        var geometry = new THREE.SphereGeometry(3);
        var material = Settings.raycasterMaterial
        var sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere)
        $("#root").mousedown((event) => {
            if (view == "game") {
                firstTime = false;
            }
            mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, camera);

            for (var i = 0; i < allies.length; i++) {
                var theContainer = allies[i].getEntityMesh()
                var intersects = raycaster.intersectObjects(theContainer.children);

                if (intersects.length > 0) {
                    for (var j = 0; j < team.allies.length; j++) {
                        if (team.allies[j].getEntityMesh().children[0].uuid ==
                            theContainer.children[0].uuid) return;
                    }
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
        $("#root").on("mousemove", (event) => {
            mousePosition = event;
        })
        setInterval(() => {
            if (mousePosition == null) return;
            mouseVector.x = (mousePosition.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(mousePosition.clientY / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, camera);

            for (var i = 0; i < allies.length; i++) {
                var theContainer = allies[i].getEntityMesh()
                var intersects = raycaster.intersectObjects(theContainer.children);

                if (intersects.length > 0) {
                    if (view == "game") {
                        var position = allies[i].getElement().position.clone();
                        var ring = new Ring(position);
                        scene.add(ring)
                        setTimeout(() => {
                            scene.remove(ring)
                        })
                    }
                    return;
                }
            }

        })
    }

    if (view == "colision") {
        var geometry = new THREE.SphereGeometry(3);
        var material = Settings.raycasterMaterial
        var theSphere = new THREE.Mesh(geometry, material);
        scene.add(theSphere)
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
        if (view == "colision") {
            var raycaster = new THREE.Raycaster();
            var worldDirection = player.getEntityMesh().getWorldDirection(new THREE.Vector3(1, 1, 1)).clone()
            worldDirection.x *= -1
            worldDirection.y *= -1
            worldDirection.z *= -1
            worldDirection.y += 0.1;
            var playerPosition = player.container.position.clone();
            playerPosition.y += 0.1;
            raycaster.ray = new THREE.Ray(playerPosition, worldDirection)
            var intersects = raycaster.intersectObject(hex, true);
            if (intersects[0]) {
                if (intersects[0].distance < 10) {
                    player.isCollide = true;
                }
                else {
                    player.isCollide = false;
                }

                theSphere.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)
            }
            else {
                player.isCollide = false;
            }
        }
        else if (view == "game") {
            var raycaster = new THREE.Raycaster();
            if (player == null) return;
            var worldDirection = player.getEntityMesh().getWorldDirection(new THREE.Vector3(1, 1, 1)).clone()
            worldDirection.x *= -1
            worldDirection.y *= -1
            worldDirection.z *= -1
            worldDirection.y += 0.5;
            var playerPosition = player.container.position.clone();
            playerPosition.y += 0.5;
            raycaster.ray = new THREE.Ray(playerPosition, worldDirection)
            var intersects = raycaster.intersectObject(level.container, true);
            if (intersects[0]) {
                if (intersects[0].distance < 15) {
                    if (!player.isCollide) {
                        player.object.setAnimation(player.standingAnimation)
                    }
                    player.isCollide = true;
                }
                else {
                    if (player.object.mixer._actions[0]._clip.name == player.standingAnimation && player.actualSpeed != 0 && firstTime == false) {
                        player.object.setAnimation(player.runningAnimation)
                    }
                    player.isCollide = false;
                }

            }
            else {
                if (player.object.mixer._actions[0]._clip.name == player.standingAnimation && player.actualSpeed != 0) {
                    player.object.setAnimation(player.runningAnimation)
                }
                player.isCollide = false;
            }
        }

    }
    render();

})