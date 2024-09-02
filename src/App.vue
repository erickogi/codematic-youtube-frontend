<template>
  <div id="app" class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-center mb-8">
      <img src="../public/codematics-logo.png" alt="Codematic Logo" class="h-12 mr-4" />
      <h1 class="text-3xl font-bold text-blue-800">Codematics Video Details</h1>
    </div>
    <div class="mb-8">
      <input v-model="videoInput" @keyup.enter="processVideoInput" placeholder="Enter YouTube video ID or URL"
        class="input-primary" />
      <button @click="processVideoInput" class="btn-primary mt-2">
        Fetch Video Details
      </button>
    </div>
    <VideoDetails :videoId="videoId" />
    <CommentList :videoId="videoId" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VideoDetails from './components/VideoDetails.vue';
import CommentList from './components/CommentList.vue';

export default defineComponent({
  name: 'App',
  components: {
    VideoDetails,
    CommentList
  },
  setup() {
    const videoInput = ref('');
    const videoId = ref('');

    const processVideoInput = () => {
      const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;
      const urlRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})/;

      if (videoIdRegex.test(videoInput.value)) {
        videoId.value = videoInput.value;
      } else {
        const match = videoInput.value.match(urlRegex);
        if (match && match[1]) {
          videoId.value = match[1];
        } else {
          alert('Invalid YouTube video ID or URL');
          return;
        }
      }
      videoInput.value = '';
    };

    return {
      videoInput,
      videoId,
      processVideoInput
    };
  }
});
</script>