import { useState, type ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  title: string;
  url: string;
  trigger: ReactNode;
}

const JobDescriptionDialog = ({ title, url, trigger }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 flex flex-col bg-white">
        <DialogHeader className="px-6 pt-6 pb-3 border-b">
          <DialogTitle className="font-heading text-klawsome-navy text-xl pr-8">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <iframe src={url} title={title} className="w-full h-full border-0" />
        </div>
        <div className="px-6 py-3 border-t flex justify-end">
          <Button asChild variant="outline" size="sm" className="rounded-full font-heading">
            <a href={url} target="_blank" rel="noopener noreferrer">Open in new tab</a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDescriptionDialog;