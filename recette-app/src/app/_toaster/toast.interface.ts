import { ToastType } from './toast.type';

export interface Toast {
    type: ToastType;
    body: String;
    delay: number;
}