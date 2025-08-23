import Swal from "sweetalert2";
import "animate.css";
import { Messages } from "./config";

// Custom Artly theme configuration
const artlyTheme = {
  colors: {
    primary: "#4E89DF", // Artly blue
    secondary: "#ff6b81", // Artly pink
    success: "#10B981", // Modern green
    error: "#EF4444", // Modern red
    warning: "#F59E0B", // Modern amber
    info: "#3B82F6", // Modern blue
    text: "#1F2937", // Dark gray for text
    background: "#FFFFFF", // White background
    border: "#E5E7EB", // Light gray border
  },
  borderRadius: "12px",
  fontFamily: "Inter, system-ui, sans-serif",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
};

export const sweetErrorHandling = async (err: any) => {
  await Swal.fire({
    icon: "error",
    text: err.message,
    showConfirmButton: false,
    background: artlyTheme.colors.background,
    color: artlyTheme.colors.text,
    confirmButtonColor: artlyTheme.colors.primary,
    iconColor: artlyTheme.colors.error,
    customClass: {
      popup: "artly-swal-popup",
      icon: "artly-swal-icon",
    },
  });
};

export const sweetTopSuccessAlert = async (
  msg: string,
  duration: number = 2000
) => {
  await Swal.fire({
    position: "center",
    icon: "success",
    title: msg.replace("Definer: ", ""),
    showConfirmButton: false,
    timer: duration,
    background: artlyTheme.colors.background,
    color: artlyTheme.colors.text,
    iconColor: artlyTheme.colors.success,
    customClass: {
      popup: "artly-swal-popup",
      icon: "artly-swal-icon",
    },
  });
};

export const sweetContactAlert = async (
  msg: string,
  duration: number = 10000
) => {
  await Swal.fire({
    title: msg,
    showClass: {
      popup: "animate__fadeInUp",
    },
    showConfirmButton: false,
    timer: duration,
    background: artlyTheme.colors.background,
    color: artlyTheme.colors.text,
    iconColor: artlyTheme.colors.info,
    customClass: {
      popup: "artly-swal-popup",
      icon: "artly-swal-icon",
    },
  }).then();
};

export const sweetConfirmAlert = (msg: string) => {
  return new Promise(async (resolve, reject) => {
    await Swal.fire({
      icon: "question",
      text: msg,
      showClass: {
        popup: "animate__fadeInUp",
      },
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: artlyTheme.colors.primary,
      cancelButtonColor: artlyTheme.colors.border,
      background: artlyTheme.colors.background,
      color: artlyTheme.colors.text,
      iconColor: artlyTheme.colors.info,
      customClass: {
        popup: "artly-swal-popup",
        icon: "artly-swal-icon",
        confirmButton: "artly-swal-btn artly-swal-btn-primary",
        cancelButton: "artly-swal-btn artly-swal-btn-secondary",
      },
    }).then((response) => {
      if (response?.isConfirmed) resolve(true);
      else resolve(false);
    });
  });
};

export const sweetLoginConfirmAlert = (msg: string) => {
  return new Promise(async (resolve, reject) => {
    await Swal.fire({
      text: msg,
      showCancelButton: true,
      showConfirmButton: true,
      color: artlyTheme.colors.text,
      confirmButtonColor: artlyTheme.colors.primary,
      cancelButtonColor: artlyTheme.colors.border,
      confirmButtonText: "Login",
      background: artlyTheme.colors.background,
      customClass: {
        popup: "artly-swal-popup",
        confirmButton: "artly-swal-btn artly-swal-btn-primary",
        cancelButton: "artly-swal-btn artly-swal-btn-secondary",
      },
    }).then((response) => {
      if (response?.isConfirmed) resolve(true);
      else resolve(false);
    });
  });
};

export const sweetErrorAlert = async (msg: string, duration: number = 3000) => {
  await Swal.fire({
    icon: "error",
    title: msg,
    showConfirmButton: false,
    timer: duration,
    background: artlyTheme.colors.background,
    color: artlyTheme.colors.text,
    iconColor: artlyTheme.colors.error,
    customClass: {
      popup: "artly-swal-popup",
      icon: "artly-swal-icon",
    },
  });
};

export const sweetMixinErrorAlert = async (
  msg: string,
  duration: number = 3000
) => {
  await Swal.fire({
    icon: "error",
    title: msg,
    showConfirmButton: false,
    timer: duration,
    background: artlyTheme.colors.background,
    color: artlyTheme.colors.text,
    iconColor: artlyTheme.colors.error,
    customClass: {
      popup: "artly-swal-popup",
      icon: "artly-swal-icon",
    },
  });
};

export const sweetMixinSuccessAlert = async (
  msg: string,
  duration: number = 2000
) => {
  await Swal.fire({
    icon: "success",
    title: msg,
    showConfirmButton: false,
    timer: duration,
    background: artlyTheme.colors.background,
    color: artlyTheme.colors.text,
    iconColor: artlyTheme.colors.success,
    customClass: {
      popup: "artly-swal-popup",
      icon: "artly-swal-icon",
    },
  });
};

export const sweetBasicAlert = async (text: string) => {
  Swal.fire({
    text: text,
    background: artlyTheme.colors.background,
    color: artlyTheme.colors.text,
    customClass: {
      popup: "artly-swal-popup",
    },
  });
};

export const sweetErrorHandlingForAdmin = async (err: any) => {
  const errorMessage = err.message ?? Messages.error1;
  await Swal.fire({
    icon: "error",
    text: errorMessage,
    showConfirmButton: false,
    background: artlyTheme.colors.background,
    color: artlyTheme.colors.text,
    iconColor: artlyTheme.colors.error,
    customClass: {
      popup: "artly-swal-popup",
      icon: "artly-swal-icon",
    },
  });
};

export const sweetTopSmallSuccessAlert = async (
  msg: string,
  duration: number = 2000,
  enable_forward: boolean = false
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
    background: artlyTheme.colors.background,
    color: artlyTheme.colors.text,
    iconColor: artlyTheme.colors.success,
    customClass: {
      popup: "artly-swal-toast",
      icon: "artly-swal-icon",
    },
  });

  Toast.fire({
    icon: "success",
    title: msg,
  }).then((data) => {
    if (enable_forward) {
      window.location.reload();
    }
  });
};

// Add custom CSS styles for Artly theme
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    .artly-swal-popup {
      border-radius: ${artlyTheme.borderRadius} !important;
      font-family: ${artlyTheme.fontFamily} !important;
      box-shadow: ${artlyTheme.boxShadow} !important;
      border: 1px solid ${artlyTheme.colors.border} !important;
    }
    
    .artly-swal-icon {
      border: 2px solid ${artlyTheme.colors.border} !important;
    }
    
    .artly-swal-btn {
      border-radius: 8px !important;
      font-weight: 500 !important;
      font-size: 14px !important;
      padding: 10px 20px !important;
      border: none !important;
      transition: all 0.2s ease !important;
    }
    
    .artly-swal-btn-primary {
      background: ${artlyTheme.colors.primary} !important;
      color: white !important;
    }
    
    .artly-swal-btn-primary:hover {
      background: #3B7CD1 !important;
      transform: translateY(-1px) !important;
    }
    
    .artly-swal-btn-secondary {
      background: ${artlyTheme.colors.border} !important;
      color: ${artlyTheme.colors.text} !important;
    }
    
    .artly-swal-btn-secondary:hover {
      background: #D1D5DB !important;
      transform: translateY(-1px) !important;
    }
    
    .artly-swal-toast {
      border-radius: 8px !important;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
      border: 1px solid ${artlyTheme.colors.border} !important;
    }
  `;
  document.head.appendChild(style);
}
