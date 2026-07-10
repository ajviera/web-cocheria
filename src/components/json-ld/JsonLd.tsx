interface JsonLdProps {
  data: Record<string, unknown>;
}

export const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    // JSON-LD requires raw script injection. `data` is built
    // server-side from our own config/i18n, never from user input.
    // Escape '<' as defense in depth against '</script>'.
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    }}
  />
);
