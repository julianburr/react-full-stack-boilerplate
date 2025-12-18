import { DotsThreeVerticalIcon, FilePdfIcon } from '@phosphor-icons/react';

import { Button } from '~/components/button';
import { DropdownMenu } from '~/components/dropdown-menu';
import { Text } from '~/components/text';
import { toast } from '~/components/toaster';
import { Tooltip } from '~/components/tooltip';

type Props = {
  data: any;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AUD',
  }).format(amount / 100);
};

export function InvoiceListItem({ data }: Props) {
  return (
    <div className="flex flex-row w-full gap-2 items-center bg-[#333]/10 p-4 rounded-md">
      <div className="flex flex-col">
        <Text strength="strong">{formatCurrency(data.amountDue)}</Text>
        <Text size="xs">Created on {new Date(data.created * 1000).toLocaleDateString()}</Text>
      </div>
      <div className="flex flex-1" />
      <Tooltip content="Download invoice">
        <Button icon={<FilePdfIcon />} variant="ghost" to={data.invoicePdf} target="_blank" />
      </Tooltip>
      <DropdownMenu
        align="end"
        items={[
          {
            label: 'Open invoice',
            to: data.hostedInvoiceUrl,
            target: '_blank',
          },
          {
            label: 'Download invoice',
            to: data.invoicePdf,
            target: '_blank',
          },
          {
            label: 'Copy invoice ID',
            onClick: () => {
              navigator.clipboard.writeText(data.id);
              toast.info('Invoice ID copied to clipboard');
            },
          },
        ]}
      >
        <Button icon={<DotsThreeVerticalIcon />} variant="ghost" />
      </DropdownMenu>
    </div>
  );
}
