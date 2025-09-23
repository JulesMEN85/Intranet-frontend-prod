import { AlertCircle } from "lucide-react"
 
import {
  Alert as AlertComponent,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const Alert = ({codeError, children}) => {
  return(
    <AlertComponent className='my-8 font-bold bg-sky-100' variant='destructive'>   
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-bold" >Code: {codeError}</AlertTitle>
      <AlertDescription>
        {children}
      </AlertDescription>
    </AlertComponent>
  );
};

export default Alert;