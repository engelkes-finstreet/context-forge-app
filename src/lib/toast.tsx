import { toast as sonnerToast } from "sonner"
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react"

/**
 * Enhanced toast utilities with icons
 * Wraps Sonner toast to automatically include icons
 */

export const toast = {
  success: (message: string, options?: Parameters<typeof sonnerToast.success>[1]) => {
    return sonnerToast.success(message, {
      ...options,
      icon: <CheckCircle2 className="h-5 w-5" />,
    })
  },

  error: (message: string, options?: Parameters<typeof sonnerToast.error>[1]) => {
    return sonnerToast.error(message, {
      ...options,
      icon: <XCircle className="h-5 w-5" />,
    })
  },

  info: (message: string, options?: Parameters<typeof sonnerToast.info>[1]) => {
    return sonnerToast.info(message, {
      ...options,
      icon: <Info className="h-5 w-5" />,
    })
  },

  warning: (message: string, options?: Parameters<typeof sonnerToast.warning>[1]) => {
    return sonnerToast.warning(message, {
      ...options,
      icon: <AlertTriangle className="h-5 w-5" />,
    })
  },
}
