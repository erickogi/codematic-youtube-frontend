<template>

    <div class="comment-list">
        <h3 class="text-xl font-semibold mb-4 text-blue-800">Comments</h3>
        <LoadingSpinner v-if="loading && comments.length === 0" />
        <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
        <div v-for="comment in comments" :key="comment.id" class="mb-4 p-4 bg-white rounded-lg shadow">
            <div class="flex items-center mb-2">
                <img :src="comment.authorProfileImageUrl" alt="Author" class="w-10 h-10 rounded-full mr-3"
                    @error="handleImageError">
                <div>
                    <h4 class="font-semibold text-blue-800">{{ comment.author }}</h4>
                    <p class="text-sm text-gray-500">{{ new Date(comment.publishedAt).toLocaleString() }}</p>
                </div>
            </div>
            <p class="mb-2 text-gray-700">{{ comment.text }}</p>
            <div class="flex text-sm text-gray-500">
                <span class="mr-4">Likes: {{ comment.likeCount }}</span>
                <span>Replies: {{ comment.replyCount }}</span>
            </div>
        </div>
        <div class="mt-4 text-center">
            <LoadingSpinner v-if="loading && comments.length > 0" />
            <button v-else-if="nextPageToken" @click="loadMore" class="btn-primary">
                Load More
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import axios from 'axios';
import { Comment, CommentsResponse } from '../types';
import LoadingSpinner from './LoadingSpinner.vue';

export default defineComponent({
    name: 'CommentList',
    components: { LoadingSpinner },
    props: {
        videoId: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const comments = ref<Comment[]>([]);
        const nextPageToken = ref<string | null>(null);
        const loading = ref(false);
        const error = ref<string | null>(null);

        const fetchComments = async (pageToken: string | null = null) => {
            if (!props.videoId) return;

            loading.value = true;
            error.value = null;
            try {
                const response = await axios.get<CommentsResponse>(`${import.meta.env.VITE_API_BASE_URL}/codematic/youtube/comments`, {
                    params: {
                        videoId: props.videoId,
                        maxResults: 20,
                        pageToken: pageToken
                    }
                });
                if (pageToken) {
                    comments.value = [...comments.value, ...response.data.comments];
                } else {
                    comments.value = response.data.comments;
                }
                nextPageToken.value = response.data.nextPageToken;
            } catch (err) {
                error.value = 'Failed to fetch comments. Please try again.';
                console.error('Error fetching comments:', err);
            } finally {
                loading.value = false;
            }
        };

        const loadMore = () => {
            fetchComments(nextPageToken.value);
        };

        const handleImageError = (event: Event) => {
            const img = event.target as HTMLImageElement;
            img.src = '/default-avatar.png';
        };

        watch(() => props.videoId, () => {
            comments.value = [];
            nextPageToken.value = null;
            if (props.videoId) {
                fetchComments();
            }
        });

        return { comments, nextPageToken, loading, error, loadMore, handleImageError };
    }
});
</script>