<template>
    <div class="video-details">
        <LoadingSpinner v-if="loading" />
        <div v-else-if="error" class="text-red-500">{{ error }}</div>
        <div v-else-if="videoDetails" class="card">
            <a :href="youtubeUrl" target="_blank" rel="noopener noreferrer" class="block mb-4">
                <img :src="thumbnailUrl" :alt="videoDetails.title" class="thumbnail">
                <div class="play-button"></div>
            </a>
            <h2 class="text-2xl font-bold mb-2 text-blue-800">{{ videoDetails.title }}</h2>
            <p class="mb-2 text-gray-600">{{ videoDetails.channelTitle }}</p>
            <p class="mb-2 text-sm text-gray-500">Published on: {{ formatDate(videoDetails.publishedAt) }}</p>
            <div class="mb-4 text-gray-600">
                <p v-if="!isExpanded" class="line-clamp-4">{{ videoDetails.description }}</p>
                <p v-else>{{ videoDetails.description }}</p>
                <button @click="toggleExpand" class="text-blue-500 hover:underline mt-2">
                    {{ isExpanded ? 'Read less' : 'Read more' }}
                </button>
            </div>
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
        const isExpanded = ref(false);

        const thumbnailUrl = computed(() => {
            if (!videoDetails.value) return '';
            const { thumbnails } = videoDetails.value;
            const baseUrl = thumbnails?.medium?.url || thumbnails?.default?.url || '';
            return baseUrl ? `${baseUrl}?w=420&h=230` : '';
        });

        const youtubeUrl = computed(() => {
            return `https://www.youtube.com/watch?v=${props.videoId}`;
        });

        const formatDate = (dateString: string) => {
            return new Date(dateString).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const toggleExpand = () => {
            isExpanded.value = !isExpanded.value;
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

        return { videoDetails, loading, error, thumbnailUrl, youtubeUrl, formatDate, isExpanded, toggleExpand };
    }
});
</script>

<style scoped>
.line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.thumbnail {
    width: 420px;
    height: 240px;
    object-fit: cover;
    margin-left: auto;
    margin-right: auto;
}

.play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-top: 20px solid transparent;
    border-left: 40px solid rgba(255, 255, 255, 0.8);
    border-bottom: 20px solid transparent;
}

a:hover .play-button {
    border-left-color: rgba(255, 255, 255, 1);
}

a {
    position: relative;
    display: inline-block;
}
</style>