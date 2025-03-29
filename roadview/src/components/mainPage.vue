<template>
  <div class="main-page">
    <div class="content">
      <img alt="basic_mascot" :src="mascotImage" />
      <h1>인천대학교 로드뷰 페이지 입니다.</h1>
      <div class="button-container">
        <router-link to="/panorama" class="view-button">
          인천대학교 로드뷰 보기
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import mascotImage from '../assets/mascot/basic_mascot.png'
</script>

<style scoped>
.main-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  background-color: white;
  margin: 0;
  padding: 0;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  max-width: 800px;
  padding: 2rem;
}

img {
  max-width: 200px;
  margin-bottom: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-align: center;
  word-break: keep-all;
}

.button-container {
  margin-top: 2rem;
  width: 100%;
  display: flex;
  justify-content: center;
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
  text-align: center;
}

.view-button:hover {
  background-color: #3aa876;
}
</style>
