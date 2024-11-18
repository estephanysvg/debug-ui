import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

/**
 * Debug
 */

const gui = new GUI({width: 300, title: 'Nice debug UI!'})

const debugObject = {}

console.log(debugObject);
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */

debugObject.color = '#fe86f4'
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Ordenar los controles del cubo
const cubeTweaks = gui.addFolder('Awesome cube')

//Cerrar ese control específico
// cubeTweaks.close()

// gui.hide()

window.addEventListener('keydown', (event) => {
    if (event.key == 'h') {
        // Toggle de show y hide
        gui.show(gui._hidden)
    }
})

console.log(mesh)

cubeTweaks.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation')

cubeTweaks.add(mesh, 'visible').name('visible')

cubeTweaks.add(material, 'wireframe')
cubeTweaks.addColor(debugObject, 'color').onChange(
    () => {
        material.color.set(debugObject.color)
    }
)

debugObject.spin = () => {
    gsap.to(mesh.rotation, {
        x: mesh.rotation.y + Math.PI * 4,
        yoyo: true,
        repeat: -1,
        duration: 8
    })
}

cubeTweaks.add(debugObject, 'spin')

debugObject.subdivision = 2

// onFinishChange ocurre cuando haces drop de la barra (con onChange sucede cada vez que cambia, es decir, pasaría por todos los valores).
cubeTweaks.add(debugObject, 'subdivision').min(1).max(20).step(1).onFinishChange(() => {
    console.log('changed');
    mesh.geometry = new THREE.BoxGeometry(
        1, 1, 1,
        debugObject.subdivision, debugObject.subdivision, debugObject.subdivision
    )
})


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()