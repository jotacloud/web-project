import { ComponentProps } from 'react';

type TableHeaderProps = ComponentProps<'th'> & {};

export function TableHeader(props: TableHeaderProps) {
  return (
    <th
      className="py-3 px-4 text-sm font-semibold text-left"
      {...props}
    />
  );
}
