<template>
  <div class="main-page">
    <img alt="basic_mascot" :src="mascotImage" />
    <h1>인천대학교 로드뷰 페이지 입니다.</h1>
    <div class="button-container">
      <router-link to="/panorama" class="view-button">
        인천대학교 로드뷰 보기
      </router-link>
    </div>
  </div>
</template>

<script setup>
import mascotImage from '../assets/basic_mascot.png'
</script>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

img {
  max-width: 200px;
  margin-bottom: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.button-container {
  margin-top: 2rem;
}

.view-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1.2rem;
  transition: background-color 0.3s;
}

.view-button:hover {
  background-color: #3aa876;
}
</style>
