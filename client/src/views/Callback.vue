<script setup lang="ts">
import { getAccessAndRefreshToken } from "@/api";
import { useTokenStore } from "@/stores/token";

const router = useRouter();
const tokenStore = useTokenStore();
const code = new URLSearchParams(window.location.search).get("code");

if (!code) {
  router.replace({ name: "Login" });
} else {
  try {
    const { data } = await getAccessAndRefreshToken(code);
    tokenStore.$patch(data);
    router.replace({ name: "Home" });
  } catch (err) {
    console.error(err);
    router.replace({ name: "Login" });
  }
}
</script>

<template>
  <div></div>
</template>
