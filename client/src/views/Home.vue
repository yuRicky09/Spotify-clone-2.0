<script setup lang="ts">
import spotifyWebApi from "spotify-web-api-node";
import { refreshToken } from "@/api";
import { useTokenStore } from "@/stores/token";

const router = useRouter();

async function init() {
  try {
    const { data } = await refreshToken();
    if (!data) {
      router.replace({ name: "Login" });
      return;
    }

    const tokenStore = useTokenStore();
    tokenStore.$patch(data);
    tokenStore.silentRefresh();

    const spotifyApi = new spotifyWebApi({});
    spotifyApi.setAccessToken(data.accessToken);

    const res = await spotifyApi.getMyTopArtists({ limit: 10 });
    console.log("🚀 ~ file: Home.vue ~ line 24 ~ init ~ res", res);
  } catch (err) {
    console.error(err);
    router.replace({ name: "Login" });
  }
}

init();
</script>

<template>
  <main></main>
</template>
