import ArrowChangeBox from "components/ArrowChangeBox";

export default function MiniTickerCard(props) {
  const { ticker, price, change, percentChange } = props;
  const isUp = parseFloat(change) > 0;

  return (
    <div className="flex flex-row border rounded-lg p-2">
      <ArrowChangeBox up={isUp} />
      <div className="flex flex-col px-2 items-begin">
        <span className="font-semibold">{ticker}</span>
        <span>{price}</span>
      </div>
      <div
        className={`flex flex-col px-1 items-end ${
          isUp ? "text-green" : "text-red"
        }`}
      >
        <span className="font-semibold">{percentChange}</span>
        <span>{change}</span>
      </div>
    </div>
  );
}
