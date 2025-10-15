import { toast } from '@/UIKit/shadcn/hooks/use-toast';

export const useToast = () => {

    const notifyToast = (message: string, variant?: "default" | "destructive" | "success" | undefined) => {
        toast({ title: message, variant });
    }

    return { notifyToast }

}