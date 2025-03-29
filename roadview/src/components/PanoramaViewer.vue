<template>
  <div ref="container" class="panorama-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let camera, scene, renderer, sphere

onMounted(() => {
  // 카메라 설정
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.set(0, 0, 0.1)

  // 씬 설정
  scene = new THREE.Scene()

  // 구체 생성 (360도 이미지를 표시할 구체)
  const geometry = new THREE.SphereGeometry(500, 60, 40)
  geometry.scale(-1, 1, 1) // 텍스처를 안쪽에서 보이도록 설정

  // 이미지 로더
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load('/src/assets/panorama.jpg') // 이미지 경로 설정
  const material = new THREE.MeshBasicMaterial({ map: texture })
  sphere = new THREE.Mesh(geometry, material)
  scene.add(sphere)

  // 렌더러 설정
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

  // 마우스 컨트롤
  let isUserInteracting = false
  let onMouseDownMouseX = 0
  let onMouseDownMouseY = 0
  let lon = 0
  let onMouseDownLon = 0
  let lat = 0
  let onMouseDownLat = 0

  container.value.addEventListener('mousedown', onMouseDown)
  container.value.addEventListener('mousemove', onMouseMove)
  container.value.addEventListener('mouseup', onMouseUp)
  container.value.addEventListener('wheel', onMouseWheel)
  window.addEventListener('resize', onWindowResize)

  function onMouseDown(event) {
    isUserInteracting = true
    onMouseDownMouseX = event.clientX
    onMouseDownMouseY = event.clientY
    onMouseDownLon = lon
    onMouseDownLat = lat
  }

  function onMouseMove(event) {
    if (isUserInteracting) {
      lon = (onMouseDownMouseX - event.clientX) * 0.1 + onMouseDownLon
      lat = (event.clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat
    }
  }

  function onMouseUp() {
    isUserInteracting = false
  }

  function onMouseWheel(event) {
    const fov = camera.fov + event.deltaY * 0.05
    camera.fov = THREE.MathUtils.clamp(fov, 30, 90)
    camera.updateProjectionMatrix()
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  // 애니메이션 루프
  function animate() {
    requestAnimationFrame(animate)
    update()
    renderer.render(scene, camera)
  }

  function update() {
    if (!isUserInteracting) {
      lon += 0.1
    }

    lat = Math.max(-85, Math.min(85, lat))
    const phi = THREE.MathUtils.degToRad(90 - lat)
    const theta = THREE.MathUtils.degToRad(lon)

    camera.position.x = 100 * Math.sin(phi) * Math.cos(theta)
    camera.position.y = 100 * Math.cos(phi)
    camera.position.z = 100 * Math.sin(phi) * Math.sin(theta)
    camera.lookAt(scene.position)
  }

  animate()
})

onBeforeUnmount(() => {
  // 리소스 정리
  if (container.value) {
    container.value.removeEventListener('mousedown', onMouseDown)
    container.value.removeEventListener('mousemove', onMouseMove)
    container.value.removeEventListener('mouseup', onMouseUp)
    container.value.removeEventListener('wheel', onMouseWheel)
    window.removeEventListener('resize', onWindowResize)
  }
  
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped>
.panorama-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

:deep(canvas) {
  width: 100% !important;
  height: 100% !important;
}
</style> 