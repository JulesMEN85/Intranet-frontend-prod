import { Button as ButtonComponent } from "@/components/ui/button";

const Button = ({variant, children}) => {
  return(
    <ButtonComponent variant={variant} >{children}</ButtonComponent>
  );
};

export default Button;
