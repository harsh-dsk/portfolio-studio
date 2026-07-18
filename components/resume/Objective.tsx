interface Props {
  text: string;
}

/** Objective — single paragraph summary. */
export function Objective({ text }: Props) {
  return (
    <p className="text-sm leading-relaxed text-fg-muted max-w-3xl">
      {text}
    </p>
  );
}
