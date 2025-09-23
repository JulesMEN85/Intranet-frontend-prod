import {
  Accordion as AccordionComponent,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Accordion = ({ month, children }) => {
  return (
    <AccordionComponent className="p-3 bg-slate-200 h-max" type="single" collapsible>
      <AccordionItem value={month}> {/* Utilisation de la valeur dynamique du mois */}
        <AccordionTrigger>{month}</AccordionTrigger>
        <AccordionContent>
          {children}
        </AccordionContent>
      </AccordionItem>
    </AccordionComponent>
  );
};

export default Accordion;
