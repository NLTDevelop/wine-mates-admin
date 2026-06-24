import { toast } from '../shadcn/use-toast'

export const useToast = () => {
  const notifyToast = (message: string, variant?: 'default' | 'destructive' | 'success' | undefined) => {
    toast({ title: message, variant })
  }

  return { notifyToast }
}
