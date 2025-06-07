import { convertBase64ToUint8Array } from "./index";
import { VAPID_PUBLIC_KEY } from "../config";
import {
  subscribePushNotification,
  unsubscribePushNotification,
} from "../data/api";

import Swal from "sweetalert2";
import "animate.css";

export function isNotificationAvailable() {
  return "Notification" in window;
}

export function isNotificationGranted() {
  return Notification.permission === "granted";
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error("Notification API unsupported.");
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === "denied") {
    Swal.fire({
      icon: "warning",
      title: "Izin notifikasi ditolak.",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
    return false;
  }

  if (status === "default") {
    Swal.fire({
      icon: "warning",
      title: "Izin notifikasi ditutup atau diabaikan.",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
  };
}

export async function subscribe() {
  if (!(await requestNotificationPermission())) {
    return;
  }

  if (await isCurrentPushSubscriptionAvailable()) {
    Swal.fire({
      title: "Anda sudah berlangganan push notification.",
      icon: "error",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
    return;
  }

  if (await isCurrentPushSubscriptionAvailable()) {
    Swal.fire({
      title: "Anda sudah berlangganan push notification.",
      icon: "error",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
    return;
  }

  console.log("Mulai berlangganan push notification...");

  function failureSubscribeMessage() {
    Swal.fire({
      title: "Langganan push notification gagal diaktifkan.",
      icon: "error",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }

  function successSubscribeMessage() {
    Swal.fire({
      title: "Langganan push notification berhasil diaktifkan.",
      icon: "success",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }

  let pushSubscription;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    pushSubscription = await registration.pushManager.subscribe(
      generateSubscribeOptions()
    );
    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await subscribePushNotification({ endpoint, keys });
    if (!response.ok) {
      console.error("subscribe: response:", response);
      failureSubscribeMessage();
      // Undo subscribe to push notification
      await pushSubscription.unsubscribe();
      return;
    }
    successSubscribeMessage();
  } catch (error) {
    console.error("subscribe: error:", error);
    failureSubscribeMessage();
    // Undo subscribe to push notification
    await pushSubscription.unsubscribe();
  }
}

export async function unsubscribe() {
  function failureUnsubscribeMessage() {
    Swal.fire({
      title: "Langganan push notification gagal dinonaktifkan.",
      icon: "error",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }

  function successUnsubscribeMessage() {
    Swal.fire({
      title: "Langganan push notification berhasil dinonaktifkan.",
      icon: "success",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }
  try {
    const pushSubscription = await getPushSubscription();
    if (!pushSubscription) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Anda tidak bisa memutus langganan push notification karena belum berlangganan sebelumnya.",
        showClass: {
          popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
        },
        hideClass: {
          popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
        },
      });
      return;
    }
    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await unsubscribePushNotification({ endpoint });
    if (!response.ok) {
      failureUnsubscribeMessage();
      console.error("unsubscribe: response:", response);
      return;
    }
    const unsubscribed = await pushSubscription.unsubscribe();
    if (!unsubscribed) {
      failureUnsubscribeMessage();
      await subscribePushNotification({ endpoint, keys });
      return;
    }
    successUnsubscribeMessage();
  } catch (error) {
    failureUnsubscribeMessage();
    console.error("unsubscribe: error:", error);
  }
}

export async function successBookmarkMessage() {
  Swal.fire({
    title: "Cerita berhasil ditambah ke bookmark.",
    icon: "success",
    showClass: {
      popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `,
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `,
    },
  });
}

export async function failureBookmarkMessage() {
  Swal.fire({
    title: "Cerita tidak berhasil ditambah ke bookmark.",
    icon: "error",
    showClass: {
      popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `,
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `,
    },
  });
}

export async function successUnbookmarkMessage() {
  Swal.fire({
    title: "Cerita berhasil dihapus dari bookmark.",
    icon: "success",
    showClass: {
      popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `,
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `,
    },
  });
}

export async function failureUnbookmarkMessage() {
  Swal.fire({
    title: "Cerita tidak berhasil dihapus dari bookmark.",
    icon: "error",
    showClass: {
      popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `,
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `,
    },
  });
}
