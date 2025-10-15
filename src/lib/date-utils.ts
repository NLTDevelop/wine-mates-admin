import { format, parseISO, differenceInDays } from "date-fns";
import { uk } from "date-fns/locale";

export const formatDate = (date: string) => {
  return format(parseISO(date), "dd MMMM yyyy", { locale: uk });
};

export const getDaysDifference = (date: string) => {
  return differenceInDays(new Date(), parseISO(date));
};
