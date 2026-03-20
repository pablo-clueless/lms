interface Props {
  onSelectDay: () => void;
}

export const TimeTable = ({}: Props) => {
  return (
    <div className="w-full rounded-xl border">
      <div className="grid grid-cols-7 rounded-t-xl border-b"></div>
      <div className="grid grid-cols-7 rounded-b-xl"></div>
    </div>
  );
};
