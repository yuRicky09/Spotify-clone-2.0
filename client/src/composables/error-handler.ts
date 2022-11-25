import axios from "axios";

export const useErrorHandler = () => {
  const errorMsg = ref("");

  function setErrorMsg(error: unknown) {
    if (axios.isAxiosError(error)) {
      errorMsg.value = error.response?.data.msg as string;
    } else if (typeof error === "string") {
      errorMsg.value = error;
    } else if (error instanceof Error) {
      errorMsg.value = error.message;
    }
  }

  return { errorMsg, setErrorMsg };
};
