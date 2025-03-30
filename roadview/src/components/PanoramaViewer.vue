<template>
  <div class="panorama-wrapper">
    <div ref="container" class="panorama-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let camera, scene, renderer, sphere
let arrowMesh

// 이미지 목록 정의
const images = [
  '/src/assets/roadview_Image/panorama.jpg',
  '/src/assets/roadview_Image/panorama2.jpg',
  '/src/assets/roadview_Image/panorama3.jpg'
]

let currentImageIndex = 0

// 이미지 전환 함수
function changeImage(direction) {
  if (direction === 'next') {
    currentImageIndex = (currentImageIndex + 1) % images.length
  } else {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length
  }

  const textureLoader = new THREE.TextureLoader()
  textureLoader.load(images[currentImageIndex], (texture) => {
    sphere.material.map = texture
    sphere.material.needsUpdate = true
  })
}

// ------------------------------- 3D 화살표 생성 함수 시작 --------------------------------
function createArrow() {
  // 화살표 머리 부분 (크기 증가)
  const arrowHead = new THREE.ConeGeometry(4, 8, 32)  // 크기 2배 증가
  // 화살표 몸통 부분 (크기 증가)
  const arrowBody = new THREE.CylinderGeometry(0.6, 0.6, 16, 32)  // 크기 2배 증가
  
  // 화살표 머리 위치 조정
  arrowHead.translate(0, 12, 0)  // 위치 조정
  // 화살표 몸통 위치 조정
  arrowBody.translate(0, 4, 0)  // 위치 조정
  
  // 화살표 회전
  arrowHead.rotateX(Math.PI / 2)
  arrowBody.rotateX(Math.PI / 2)
  
  // 재질 생성 (색상 변경 및 투명도 조정)
  const material = new THREE.MeshBasicMaterial({ 
    color: 0x00ff00,  // 초록색으로 변경
    transparent: true,
    opacity: 1  // 불투명도 증가
  })
  
  // 메시 생성
  const head = new THREE.Mesh(arrowHead, material)
  const body = new THREE.Mesh(arrowBody, material)
  
  // 그룹으로 묶기
  const arrow = new THREE.Group()
  arrow.add(head)
  arrow.add(body)
  
  return arrow
}

// 화살표 위치 설정 함수
function positionArrow() {
  // 구면 좌표계로 변환 (위도, 경도)
  const lat = 0  // 위도 (상하)
  const lon = 0  // 경도 (좌우) - 정면으로 변경
  
  // 구면 좌표를 3D 좌표로 변환
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lon)
  
  const radius = 400  // 구체 내부에서의 거리 조정
  
  const x = radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  
  arrowMesh.position.set(x, y, z)
  
  // 화살표가 카메라를 향하도록 회전
  arrowMesh.lookAt(0, 0, 0)
}

// ------------------------------- 3D 화살표 생성 함수 끝 --------------------------------

onMounted(() => {
  // 카메라 설정 (시야각 조정)
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.set(0, 0, 0.1)

  // 씬 설정
  scene = new THREE.Scene()

  // 구체 생성 (360도 이미지를 표시할 구체)
  const geometry = new THREE.SphereGeometry(500, 60, 40)
  geometry.scale(-1, 1, 1) // 텍스처를 안쪽에서 보이도록 설정

  // 이미지 로더
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load('/src/assets/roadview_Image/panorama.jpg')
  const material = new THREE.MeshBasicMaterial({ map: texture })
  sphere = new THREE.Mesh(geometry, material)
  scene.add(sphere)

  // 화살표 생성 및 추가
  arrowMesh = createArrow()
  scene.add(arrowMesh)
  positionArrow()

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

  // 클릭 이벤트 추가
  container.value.addEventListener('click', onMouseClick)

  function onMouseClick(event) {
    // 마우스 좌표를 정규화된 장치 좌표로 변환
    const mouse = new THREE.Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    // 레이캐스터 생성
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)

    // 화살표와의 교차점 확인
    const intersects = raycaster.intersectObject(arrowMesh)
    if (intersects.length > 0) {
      changeImage('next')
    }
  }
  

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
    lat = Math.max(-85, Math.min(85, lat))
    const phi = THREE.MathUtils.degToRad(90 - lat)
    const theta = THREE.MathUtils.degToRad(lon)

    // 카메라 위치 조정 (거리 증가)
    camera.position.x = 150 * Math.sin(phi) * Math.cos(theta)
    camera.position.y = 150 * Math.cos(phi)
    camera.position.z = 150 * Math.sin(phi) * Math.sin(theta)
    camera.lookAt(scene.position)
  }

  animate()
})

onBeforeUnmount(() => {
  if (container.value) {
    container.value.removeEventListener('mousedown', onMouseDown)
    container.value.removeEventListener('mousemove', onMouseMove)
    container.value.removeEventListener('mouseup', onMouseUp)
    container.value.removeEventListener('wheel', onMouseWheel)
    container.value.removeEventListener('click', onMouseClick)
    window.removeEventListener('resize', onWindowResize)
  }
  
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped>
.panorama-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
}

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