import { refreshToken } from "@/api";

import type { TokenInfo } from "@/types";

interface TokenStoreState extends TokenInfo {
  timer: null | number;
}

export const useTokenStore = defineStore("token", {
  state: (): TokenStoreState => {
    return {
      accessToken: "",
      refreshToken: "",
      expiresIn: 0,
      tokenType: "",
      scope: "",
      timer: null,
    };
  },
  actions: {
    silentRefresh() {
      this.timer && clearInterval(this.timer);

      this.timer = setInterval(async () => {
        const { data } = await refreshToken();

        this.$patch(data);
      }, this.expiresIn * 1000 - 60000);
    },
  },
});
