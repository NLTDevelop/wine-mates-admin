import { FormControl, FormField, FormItem, FormLabel} from '@/UIKit/shadcn/ui/form'
import { FC } from "react";
import { NLTComplexComboboxData } from '../NLTComplexComboboxData';


export interface IOption {
  value: any;
  label: string;
  [key: string]: any;
}

interface IProps {
  form: any;
  formLabel?: string;
  name: string;
  disabled?: boolean;
  placeholder?: string;
  searchLabel?: string;
  // fetchOptions: (search?: string) => Promise<IOption[]>;
  options?: IOption[];
  disableClear?: boolean;
  is_dynamic?: boolean;
  onCreateOption?: (data: string, id: string) => Promise<IOption | null>;
}

export const NLTComplexComboboxFormFieldData: FC<IProps> = ({
  form,
  formLabel = "",
  name,
  disabled,
  placeholder,
  searchLabel,
  options,
  disableClear,
  is_dynamic,
  onCreateOption,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel className={`${disabled && "text-gray-400 dark:text-[#525252]"}`}>{formLabel}</FormLabel>
          <FormControl>
            <NLTComplexComboboxData
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder || formLabel}
              searchLabel={searchLabel || "Пошук"}
              disabled={disabled}
              options={options}
              disableClear={disableClear}
              allowAdd={is_dynamic}
              onCreateOption={onCreateOption}
              name={name}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
