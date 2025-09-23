'useClient'

import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Select = () => {
  return(
  <SelectComponent>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Entreprise" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="MEN85">MEN85</SelectItem>
    </SelectContent>
  </SelectComponent>

  );
};

export default Select;