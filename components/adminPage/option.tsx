import Image from "next/image";

interface OptionProps {
  icon: String;
  title: String;
}

export const Option = ({ icon, title }: OptionProps) => {
  return (
    <>
      <div className="flex justify-center items-center gap-2">
        <Image src={"dsf"} alt="optionImage" width={50} height={50} />
        <p>{title}</p>
      </div>
    </>
  );
};
