import { InfoBox, InfoBoxVariantOptions } from "./InfoBox";

const infos: Array<{
  storageKey: string;
  variant: InfoBoxVariantOptions["variant"];
  content: string;
}> = [
  {
    storageKey: "block_info_202405_1",
    variant: "info",
    content: "Nächster THL Block: 30. Mai - 02. Juni",
  },
];

export function AppInfoStack() {
  if (infos.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-1">
      {infos.map((info) => (
        <li key={info.storageKey} className="px-1">
          <InfoBox storageKey={info.storageKey} variant={info.variant}>
            {info.content}
          </InfoBox>
        </li>
      ))}
    </ul>
  );
}
