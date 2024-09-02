<template>
    <div class="video-details">
        <LoadingSpinner v-if="loading" />
        <div v-else-if="error" class="text-red-500">{{ error }}</div>
        <div v-else-if="videoDetails" class="card">
            <img :src="thumbnailUrl" :alt="videoDetails.title" class="mb-4 w-full">
            <h2 class="text-2xl font-bold mb-2 text-blue-800">{{ videoDetails.title }}</h2>
            <p class="mb-2 text-gray-600">{{ videoDetails.channelTitle }}</p>
            <p class="mb-2 text-sm text-gray-500">Published on: {{ formatDate(videoDetails.publishedAt) }}</p>
            <p class="mb-4 text-gray-600">{{ videoDetails.description }}</p>
            <div class="flex justify-between text-sm text-gray-500">
                <span>Views: {{ videoDetails.viewCount.toLocaleString() }}</span>
                <span>Likes: {{ videoDetails.likeCount.toLocaleString() }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import axios from 'axios';
import type { VideoDetails } from '../types';
import LoadingSpinner from './LoadingSpinner.vue';

export default defineComponent({
    name: 'VideoDetails',
    components: { LoadingSpinner },
    props: {
        videoId: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const videoDetails = ref<VideoDetails | null>(null);
        const loading = ref(false);
        const error = ref<string | null>(null);

        const thumbnailUrl = computed(() => {
            if (!videoDetails.value) return '';
            const { thumbnails } = videoDetails.value;
            return thumbnails?.medium?.url || thumbnails?.default?.url || '';
        });

        const formatDate = (dateString: string) => {
            return new Date(dateString).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const fetchVideoDetails = async () => {
            if (!props.videoId) return;

            loading.value = true;
            error.value = null;
            try {
                const response = await axios.get<VideoDetails>(`${import.meta.env.VITE_API_BASE_URL}/codematic/youtube/video/${props.videoId}`);
                videoDetails.value = response.data;
            } catch (err) {
                error.value = 'Failed to fetch video details. Please try again.';
                console.error('Error fetching video details:', err);
            } finally {
                loading.value = false;
            }
        };

        watch(() => props.videoId, fetchVideoDetails);

        return { videoDetails, loading, error, thumbnailUrl, formatDate };
    }
});
</script>