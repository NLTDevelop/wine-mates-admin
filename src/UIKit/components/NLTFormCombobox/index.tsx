import { FC } from "react";
import { NLTCombobox } from "../NLTCombobox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/UIKit/shadcn/ui/form";

export interface IOption{
    value: string; 
    label: string;
};

interface IProps {
    form: any;
    formLabel: string;
    name: string;
    disabled?: boolean;
    placeholder?: string;
    searchLabel?: string;
    fetchOptions: () => Promise<IOption[]>;
    options?: IOption[];
};

export const NLTComboboxFormField: FC<IProps> = ({ form, formLabel, name, disabled, placeholder, searchLabel, fetchOptions, options }) => {
    
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }: any) => (
                <FormItem>
                    <FormLabel>{formLabel}</FormLabel>
                    <FormControl>
                        <NLTCombobox
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={placeholder}
                            searchLabel={searchLabel}
                            disabled={disabled}
                            fetchOptions={fetchOptions}
                            itemOptions={options}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
    );
};
