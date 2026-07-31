export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD must be inlined as raw JSON for search engines to read it.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
