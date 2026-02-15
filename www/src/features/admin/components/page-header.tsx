export interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader(props: PageHeaderProps) {
  const { title, description } = props;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
