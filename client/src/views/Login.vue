<script setup lang="ts">
import { login } from "@/api";
import { useErrorHandler } from "@/composables/error-handler";

const { errorMsg, setErrorMsg } = useErrorHandler();

async function loginSpotify() {
  try {
    const res = await login();
    window.location.href = res.data.url;
  } catch (err) {
    setErrorMsg(err);
  }
}
</script>

<template>
  <div
    class="grid h-screen w-full place-content-center overflow-hidden bg-black"
  >
    <img
      src="@/assets/images/spotify-logo.png"
      alt="spotify"
      class="mb-4 w-52"
    />
    <button
      class="rounded-full bg-[#18d860] p-5 text-white"
      @click="loginSpotify"
    >
      Login With Spotify
    </button>
    <span class="text-red-500">{{ errorMsg }}</span>
  </div>
</template>
